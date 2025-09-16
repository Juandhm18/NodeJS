import "dotenv/config"
import express from 'express'
import cors from 'cors'
import { router, initRoutes } from './routes/index.ts'

const PORT = process.env.PORT || 3003

const app = express()

app.use(cors())
app.use(express.json())

await initRoutes()
app.use(router)

app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`)
})