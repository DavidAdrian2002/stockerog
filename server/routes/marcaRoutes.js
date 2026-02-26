import express from "express";
import Marca from "../models/Marca.js";

const router = express.Router();

// Crear marca
router.post("/", async (req, res) => {
  try {
    const { nombre, imagen, descripcion } = req.body;

    const nuevaMarca = new Marca({
      nombre,
      imagen,
      descripcion,
    });

    await nuevaMarca.save();

    res.status(201).json(nuevaMarca);
  } catch (error) {
    res.status(500).json({ message: "Error creando marca" });
  }
});

// Obtener todas las marcas
router.get("/", async (req, res) => {
  try {
    const marcas = await Marca.find().sort({ createdAt: -1 });
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo marcas" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Marca.findByIdAndDelete(req.params.id);
    res.json({ message: "Marca eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando marca" });
  }
});

export default router;