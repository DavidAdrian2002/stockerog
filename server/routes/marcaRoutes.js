import express from "express";
import Marca from "../models/Marca.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "temp/" });

/* =========================
   🔹 CREAR MARCA
========================= */
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "storeckog_marcas",
      });

      imageUrl = result.secure_url;
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


/* =========================
   🔹 OBTENER TODAS
========================= */
router.get("/", async (req, res) => {
  try {
    const marcas = await Marca.find().sort({ createdAt: -1 });
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo marcas" });
  }
});


/* =========================
   🔹 OBTENER POR ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const marca = await Marca.findById(req.params.id);
    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" });
    }
    res.json(marca);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo marca" });
  }
});


/* =========================
   🔹 EDITAR MARCA
========================= */
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const marca = await Marca.findById(req.params.id);
    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" });
    }

    let imageUrl = marca.imagen;

    // Si se sube nueva imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "storeckog_marcas",
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    marca.nombre = nombre;
    marca.descripcion = descripcion;
    marca.imagen = imageUrl;

    await marca.save();

    res.json(marca);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando marca" });
  }
});


/* =========================
   🔹 ELIMINAR MARCA
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Marca.findByIdAndDelete(req.params.id);
    res.json({ message: "Marca eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando marca" });
  }
});

export default router;