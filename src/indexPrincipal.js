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

// Rutas de API
app.use(paymentRoutes);

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

