import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Marca = mongoose.model("Marca", marcaSchema);

export default Marca;