import { Router } from 'express'
import { readdirSync } from 'fs'
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PATH_ROUTER = join(__dirname)

const router:Router = Router()

const cleanFileName = (fileName: string) => { 
    return fileName.split('.').shift()
}

export async function initRoutes() {
  for (const fileName of readdirSync(PATH_ROUTER)) {
    const cleanName = cleanFileName(fileName)
    if (cleanName !== 'index') {
      const moduleRouter = await import(`./${cleanName}.ts`)
      router.use(`/${cleanName}`, moduleRouter.router)
    }
  }
}

export { router }