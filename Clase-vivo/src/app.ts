import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initRoutes, router } from './routes/index.ts'

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())

await initRoutes()
app.use(router)

app.listen(PORT, ()=>{console.log(`servidor iniciado en el puerto ${PORT}`)})