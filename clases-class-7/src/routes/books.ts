import { Router, type Request, type Response } from 'express'
import { createBook, getBook, getBooks } from '../controllers/books.ts'

const router:Router = Router()
/**
 * http://localhost:3002/books
 */

router.get("/", (req:Request, res:Response)=> {
    getBooks(req, res)
})
router.get('/:id', getBook)
router.post('/', createBook)

export { router }