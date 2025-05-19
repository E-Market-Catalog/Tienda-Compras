import mercadopage from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";

mercadopage.configure({
  access_token: MERCADOPAGO_API_KEY,
});

export const createOrder = async (req, res) => {
  try {
    const result = await mercadopage.preferences.create({
      items: req.body.items,  // usa los items que llegan desde el cliente

      // 👇 AÑADIR ESTO para enviar los datos del comprador
      payer: {
        name: "Araceli",
        surname: "Terrones",
        email: "jersonybrayan@gmail.com",
        identification: {
          type: "DNI",
          number: "40699073"
        },
        phone: {
          area_code: "51",
          number: 971010274
        }
      },

      notification_url: "https://tienda-compras.onrender.com/webhook",
      back_urls: {
        success: "https://tienda-compras.onrender.com/success",
        failure: "https://tienda-compras.onrender.com/failure",
        pending: "https://tienda-compras.onrender.com/pending",
      }
    });

    console.log("Preferencia creada con éxito:", result.body);
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
    const query = req.query;
    console.log("Webhook recibido:", query);

    if (query.topic === "payment" || query.type === "payment") {
      const paymentId = query["data.id"] || query.id;
      const paymentData = await mercadopage.payment.findById(paymentId);
      console.log("Datos del pago:", paymentData.body);
    } else if (query.topic === "merchant_order" || query.type === "merchant_order") {
      const merchantOrderId = query.id;
      const merchantOrderData = await mercadopage.merchant_orders.findById(merchantOrderId);
      console.log("Datos de la orden de comercio:", merchantOrderData.body);
    } else {
      console.log("Tipo de webhook no manejado:", query);
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return res.status(500).json({ message: "Algo salió mal procesando webhook" });
  }
};
