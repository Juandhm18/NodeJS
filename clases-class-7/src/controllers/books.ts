import { type Request, type Response } from 'express';
import { handleHttp } from '../utils/error.handler.ts'
import { type HttpErrorStatus } from '../types/types.ts'
import { getBooks as getBooksService } from '../services/book.service.ts';

const getBook = (req: Request, res: Response) => {  
    const statusCode: HttpErrorStatus = 500
    try {
        
    }catch(err){
        handleHttp(res, "Something crashed your app", statusCode, err)
    }
}

const getBooks = (req: Request, res: Response) => {  
    try {
        getBooksService().then((response)=>{
            res.json(response)
        })
    }catch(err){
        
    }
}

const deleteBooks = (req: Request, res: Response) => {  
    try {

    }catch(err){
        
    }
}

const createBook = (req: Request, res: Response) => {  
    try {

    }catch(err){
        
    }
}

const updateBooks = (req: Request, res: Response) => {  
    try {

    }catch(err){
        
    }
}

export { getBook, getBooks, deleteBooks, createBook, updateBooks}