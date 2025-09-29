/*
Event Loop
hoisting
desestructuracion de objetos 
shallow and deep copy
patrones de diseño
antipatterns
this in js => bind, call, apply
closures
express
arquitectura de microservicios
buenas practicas en los controladores => sun logica de negocio y usar try catch
== y ===

*/

/*
sequelize
*/

import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async (htmlContent: string, recipients: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: "Notification from Library System",
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

export { sendEmail };