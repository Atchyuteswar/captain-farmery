import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "Captain Farmery <hello@captainfarmery.com>";

export async function sendOrderConfirmationEmail({
  email,
  customerName,
  orderNumber,
  total,
  items,
}: {
  email: string;
  customerName: string;
  orderNumber: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email not sent.");
    return;
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Order Confirmation - #${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName,
        orderNumber,
        total,
        items,
      }),
    });
    return data;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
}
