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

// 🔹 Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Subimos un nivel (porque estamos dentro de /server)
const rootDir = path.join(__dirname, "..");

// 🔹 Rutas API
app.use("/api/marcas", marcaRoutes);
app.use("/api/productos", productoRoutes);

// 🔹 Archivos estáticos (CORREGIDOS)
app.use(express.static(path.join(rootDir, "public")));
app.use("/admin", express.static(path.join(rootDir, "admin")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/images", express.static(path.join(rootDir, "images")));

// 🔹 Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});