import "dotenv/config"
import express from 'express'
import cors from 'cors'
import { router, initRoutes } from './routes/index.ts'

const PORT = process.env.PORT || 3002

const app = express()

// CORS configurado para permitir localhost
app.use(cors({
    origin: ['http://localhost:3001', 'http://192.168.40.99:3001'], // Múltiples orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

await initRoutes()
app.use(router)

app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`)
})