import mercadopage from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";

mercadopage.configure({
  access_token: MERCADOPAGO_API_KEY,
});

export const createOrder = async (req, res) => {
  try {
    const result = await mercadopage.preferences.create({
      items: req.body.items,  // usa los items que llegan desde el cliente
      notification_url: "https://1c96-2800-4b0-8002-931f-55e2-d00b-fdaa-64c3.ngrok-free.app/webhook",
      back_urls: {
        success: "https://1c96-2800-4b0-8002-931f-55e2-d00b-fdaa-64c3.ngrok-free.app/success",
        //failure: "https://1c96-2800-4b0-8002-931f-55e2-d00b-fdaa-64c3.ngrok-free.app/failure",
        //pending: "https://1c96-2800-4b0-8002-931f-55e2-d00b-fdaa-64c3.ngrok-free.app/pending",
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
    const payment = req.query;
    console.log(payment);
    if (payment.type === "payment") {
      const data = await mercadopage.payment.findById(payment["data.id"]);
      console.log(data);
    }
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
