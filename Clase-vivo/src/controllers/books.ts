import { type Request, type Response } from 'express';
import { handleHttp } from '../utils/error.handler.ts';
import type { HttpErrorStatus } from '../types/types.ts';
import { getBooks as getBooksService } from '../services/book.service.ts';
import { addBook } from '../services/book.service.ts';
import { deleteBook } from '../services/book.service.ts';
import { NewUpdateBook } from '../services/book.service.ts';
import { getBookById } from '../services/book.service.ts';

const getBooks = (req:Request, res:Response)=>{
    let statusCode:HttpErrorStatus = 500;
    try{
        getBooksService().then((response) => {
            res.send(response)
        })
    }catch(err){
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
};

const getBookId = (req: Request, res: Response) => {
    const statusCode: HttpErrorStatus = 500
    try {
        const { id } = req.params
        if (id) {
            getBookById(id).then((response) => {
                console.log(response)
                res.send(response)
            })
        }
    } catch (err) {
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
}

const deleteBooks = async (req: Request, res: Response) => {  
    let statusCode:HttpErrorStatus = 500;
    try {
        const id = req.params.id!;
        const deleted = await deleteBook(id);
        if (!deleted) {
        res.status(404).send({ message: "Book not found" });
        } else {
        res.status(204).send(); 
        }
    }catch(err){
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
}

const createBook = async (req: Request, res: Response) => {  
    let statusCode:HttpErrorStatus = 500;
    try {
        const data = req.body
        await addBook(data);
        res.status(201).send(data); 
    }catch(err){
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
}

const updateBooks = async (req: Request, res: Response) => {  
    let statusCode:HttpErrorStatus = 500;
    try {
        const id = req.params.id;
        if (typeof id !== 'string') {
            return res.status(400).json({ message: "ID must be provided" });
        }
        const data = req.body;
        const updatedBook = await NewUpdateBook(id, data);
        res.send(updatedBook);
    }catch(err){
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
}

export { getBooks, deleteBooks, createBook, updateBooks, getBookId }