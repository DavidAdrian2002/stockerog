import express from "express";
import Producto from "../models/Producto.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// ✅ Crear producto con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { marcaId, nombre, precio, stock, talle, descripcion } = req.body;

    const nuevoProducto = new Producto({
      marcaId,
      nombre,
      precio,
      stock,
      talle,
      descripcion,
      imagen: req.file ? req.file.filename : null
    });

    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto" });
  }
});


// ✅ Obtener productos por marca
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


// ✅ Eliminar producto
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