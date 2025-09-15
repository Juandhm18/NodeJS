import { Router, type Request, type Response} from "express";  
import { readdirSync } from "fs";
import { getBooks, deleteBooks, createBook, updateBooks,getBookId } from "../controllers/books.ts";

const router:Router = Router()

router.get('/', (req:Request, res:Response)=>{
    console.log("vamos ok")
    getBooks(req, res)
})
router.get('/:id',getBookId)
router.post('/', createBook)
router.put('/:id', updateBooks)
router.delete('/:id', deleteBooks)

export {router}