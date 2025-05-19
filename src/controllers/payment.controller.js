import mercadopage from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";

mercadopage.configure({
  access_token: MERCADOPAGO_API_KEY,
});

export const createOrder = async (req, res) => {
  try {
    const result = await mercadopage.preferences.create({
      items: req.body.items,  // usa los items que llegan desde el cliente
      payer: {
        email: "jersonybrayan@gmail.com" // o el email del cliente
      },
      notification_url: "https://tienda-compras.onrender.com/webhook",
      back_urls: {
        success: "https://tienda-compras.onrender.com/success",
        //failure: "https://tienda-compras.onrender.com/failure",
        //pending: "https://tienda-compras.onrender.com/pending",
      },


    });

    res.json(result.body);
  } catch (error) {
    console.error("Error creando preferencia MercadoPago:", error);
    if (error.response && error.response.body) {
      console.error("Detalles del error:", error.response.body);
    }
    res.status(500).json({ message: error.message || "Algo salió mal" });
  }
};


export const receiveWebhook = async (req, res) => {
  try {
    const { topic, id } = req.body;  // MercadoPago envía topic e id en body
    console.log('Webhook recibido:', topic, id);

    if (topic === "payment") {
      const payment = await mercadopage.payment.findById(id);
      console.log('Detalles pago:', payment);
    } else if (topic === "merchant_order") {
      const merchantOrder = await mercadopage.merchant_orders.get(id);
      console.log('Detalles orden:', merchantOrder);
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ message: "Error procesando webhook" });
  }
};

