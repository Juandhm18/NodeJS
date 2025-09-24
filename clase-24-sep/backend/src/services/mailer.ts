import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS, // contraseña de aplicación
  },
});

export async function sendReminder(email: string, book: string, dueDate: string, daysLate: number) {
  await transporter.sendMail({
    from: `"Biblioteca Virtual" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recordatorio de devolución",
    text: `Hola, recuerda devolver el libro "${book}" que venció el ${dueDate}.
Llevas ${daysLate} días de atraso.`,
  });
}
