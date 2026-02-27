import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import marcaRoutes from "./routes/marcaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();



app.use(cors());
app.use(express.json());


app.use("/api/marcas", marcaRoutes);
app.use("/api/productos", productoRoutes);




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "public")));


app.use("/admin", express.static(path.join(__dirname, "admin")));


app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});