const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { descripcion, categoria } = req.body;
  const nueva = new Task({
    descripcion,
    categoria,
    usuario: req.user.id,
  });
  await nueva.save();
  res.json(nueva);
});

router.patch("/:id/complete", auth, async (req, res) => {
  const tarea = await Task.findOneAndUpdate(
    { _id: req.params.id, usuario: req.user.id },
    { completada: true, completadaPor: req.user.id },
    { new: true }
  );
  if (!tarea)
    return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
  res.json(tarea);
});

router.get("/completadas/:categoria", auth, async (req, res) => {
  const tareas = await Task.find({
    categoria: req.params.categoria,
    completada: true,
    usuario: req.user.id,
  }).populate("completadaPor", "nombre");
  res.json(tareas);
});

router.get("/pendientes", auth, async (req, res) => {
  try {
    const tareas = await Task.find({
      completada: false,
      usuario: req.user.id,
    }).sort({ fecha: -1 });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tareas activas" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const tarea = await Task.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id,
    });

    if (!tarea)
      return res
        .status(404)
        .json({ msg: "Tarea no encontrada o no autorizada" });
    res.json({ msg: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
});

module.exports = router;
