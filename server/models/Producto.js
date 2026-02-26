import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    marcaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marca",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    talle: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;