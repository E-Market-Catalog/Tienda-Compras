//indexPrinciapl.js

import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoutes from "./routes/payment.routes.js";
import cors from 'cors';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


// Rutas
app.use(paymentRoutes);

// Archivos estáticos (index.html, index.js, etc.)
app.use(express.static(__dirname));

// Servidor
//app.listen(3001, () => {  console.log("Servidor corriendo en http://localhost:3001");});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
