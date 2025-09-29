import { type Request, type Response } from "express";
import { getBooksService, getBooksByIDService, postBooksService, putBooksService, deleteBooksService} from "../services/books.services.js";

const getBooks = async (req:Request, res: Response): Promise<void> => {
    try {
        const books = await getBooksService();
        res.send(books);
    } catch (error) {
        res.status(500).send("Error retrieving books");
    }
};

const getBooksByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const book = await getBooksByIDService(Number(id));
        if (!book) {
            res.status(404).send("Book not found");
            return;
        };
        res.send(book);
    } catch (error) {
        res.status(500).send("Error retrieving book");
    }
};

const postBooks = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newBook = req.body;
        if (!newBook || !newBook.title || !newBook.author || !newBook.ISBN || !newBook.genre || !newBook.language || !newBook.coverURL || !newBook.description || !newBook.status || !newBook.createdAt || !newBook.ownerID) {
            res.status(400).send("Invalid book data");
            return;
        };
        const books = await getBooksService();
        if ( books.find( b => b.id === newBook.id ) ) {
            res.status(400).send("Book with this ID already exists");
            return;
        }
        const book = await postBooksService(newBook);
        res.send(book);
    } catch (error) {
        res.status(500).send("Error creating book");
    }
};

const putBooks = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedBook = req.body;
        const books = await getBooksByIDService(Number(id));
        if (!books) {
            res.status(404).send("Book not found");
            return;
        }
        const book = await putBooksService(Number(id), updatedBook);
        if (!book) {
            res.status(404).send("Book not found");
            return;
        }
        res.send(book);
    } catch (error) {
        res.status(500).send("Error updating book");
    }
};

const deleteBooks = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const book = await getBooksByIDService(Number(id));
        if (!book) {
            res.status(404).send("Book not found");
            return;
        }
        const success = await deleteBooksService(Number(id));
        if (!success) {
            res.status(404).send("Book not found");
            return;
        }
        res.send({ message: "Book deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting book");
    }
}

export { getBooks, getBooksByID, postBooks, putBooks, deleteBooks };