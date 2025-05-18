//payment.routes.js

import { Router } from "express";
import {
  createOrder,
  receiveWebhook,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", createOrder);

router.post("/webhook", receiveWebhook);

router.get("/success", (req, res) => {
  res.send(`
    <h1>¡Pago acreditado con éxito!</h1>
    <p>Gracias por tu compra.</p>
    <button onclick="window.location.href='http://localhost:5500/index.html'">Volver a la tienda</button>
  `);
});


export default router;
