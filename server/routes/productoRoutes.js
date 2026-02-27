import express from "express";
import Producto from "../models/Producto.js";
import upload from "../middleware/upload.js";

const router = express.Router();



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



router.delete("/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
});


router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, precio, stock, talle, descripcion } = req.body;

    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar campos
    producto.nombre = nombre;
    producto.precio = precio;
    producto.stock = stock;
    producto.talle = talle;
    producto.descripcion = descripcion;

    // Si se sube nueva imagen, actualizar
    if (req.file) {
      producto.imagen = req.file.filename;
    }

    await producto.save();

    res.json(producto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando producto" });
  }
});

export default router;