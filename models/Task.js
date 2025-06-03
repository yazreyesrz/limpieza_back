const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  descripcion: String,
  categoria: String,
  completada: { type: Boolean, default: false },
  completadaPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // 🆕
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
