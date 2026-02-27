import express from "express";
import Marca from "../models/Marca.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

// Configuración temporal de multer
const upload = multer({ dest: "temp/" });

// 🔹 Crear marca con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "storeckog_marcas",
      });

      imageUrl = result.secure_url;

      // eliminar archivo temporal
      fs.unlinkSync(req.file.path);
    }

    const nuevaMarca = new Marca({
      nombre,
      imagen: imageUrl,
      descripcion,
    });

    await nuevaMarca.save();

    res.status(201).json(nuevaMarca);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando marca" });
  }
});

// 🔹 Obtener todas las marcas
router.get("/", async (req, res) => {
  try {
    const marcas = await Marca.find().sort({ createdAt: -1 });
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo marcas" });
  }
});

// 🔹 Eliminar marca
router.delete("/:id", async (req, res) => {
  try {
    await Marca.findByIdAndDelete(req.params.id);
    res.json({ message: "Marca eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando marca" });
  }
});

export default router;