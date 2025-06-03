const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

require("dotenv").config();

// Registro
router.post("/register", async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  const userExist = await User.findOne({ correo });
  if (userExist) return res.status(400).json({ msg: "Correo ya registrado" });

  const hash = await bcrypt.hash(contrasena, 10);
  const user = new User({ nombre, correo, contrasena: hash });
  await user.save();

  res.json({ msg: "Usuario registrado" });
});

// Login
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;
  const user = await User.findOne({ correo });
  if (!user) return res.status(400).json({ msg: "Correo no encontrado" });

  const match = await bcrypt.compare(contrasena, user.contrasena);
  if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, nombre: user.nombre });
});

router.get("/usuarios", auth, async (req, res) => {
  try {
    const usuarios = await User.find().select("-contrasena"); // Oculta la contraseña
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

module.exports = router;
