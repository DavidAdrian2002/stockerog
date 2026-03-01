import express from "express";
import Producto from "../models/Producto.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "temp/" });

/* =========================
   🔹 CREAR PRODUCTO
========================= */
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { marcaId, nombre, precio, stock, talle, descripcion } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "storeckog_productos",
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const nuevoProducto = new Producto({
      marcaId,
      nombre,
      precio,
      stock,
      talle,
      descripcion,
      imagen: imageUrl
    });

    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto" });
  }
});


/* =========================
   🔹 OBTENER PRODUCTO
========================= */
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo producto" });
  }
});


/* =========================
   🔹 OBTENER POR MARCA
========================= */
router.get("/marca/:marcaId", async (req, res) => {
  try {
    const productos = await Producto.find({
      marcaId: req.params.marcaId
    }).sort({ createdAt: -1 });

    res.json(productos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo productos" });
  }
});


/* =========================
   🔹 EDITAR PRODUCTO
========================= */
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, precio, stock, talle, descripcion } = req.body;

    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    producto.nombre = nombre;
    producto.precio = precio;
    producto.stock = stock;
    producto.talle = talle;
    producto.descripcion = descripcion;

    // Si se sube nueva imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "storeckog_productos",
      });

      producto.imagen = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await producto.save();

    res.json(producto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando producto" });
  }
});


/* =========================
   🔹 ELIMINAR PRODUCTO
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
});

export default router;