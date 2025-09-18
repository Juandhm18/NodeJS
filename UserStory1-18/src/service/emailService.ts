import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { text } from 'stream/consumers';
import { getNasaApod } from './apiService';

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

export const sendNasaSummaryEmail = async (subject:string, body:string): Promise<void> => {
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject, 
            html: body
        })
        console.log("enviado")
    } catch (error){
        console.error("fallo", error)
    }
}
