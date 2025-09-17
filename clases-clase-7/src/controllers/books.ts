import { type Request, type Response } from "express";
import { handleHttp } from "../utils/error.handler.ts";
import { type HttpErrorStatus } from "../types/types.ts";
import {
    getBooks as getBooksService,
    getBook as getBookService,
    createBook as createBookService,
    updateBook as updateBookService,
    deleteBook as deleteBookService,
} from "../services/book.service.ts";

const getBooks = async (req: Request, res: Response) => {
    try {
        const response = await getBooksService();
        res.send(response);
    } catch (err) {
        handleHttp(res, "Error getting books", 500, err);
    }
};

const getBook = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return handleHttp(res, "Id is required", 400);
    }

    try {
        const response = await getBookService(id);
        if (!response) {
            return handleHttp(res, "Book not found", 404);
        }
        res.send(response);
    } catch (err) {
        handleHttp(res, "Error getting book", 500, err);
    }
};

const deleteBooks = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return handleHttp(res, "Id is required", 400);
    }

    try {
        const response = await deleteBookService(id);
        if (!response) {
            return handleHttp(res, "Book not found", 404);
        }

        res.send({ message: "Book deleted", response });
    } catch (err) {
        handleHttp(res, "Error deleting book", 500, err);
    }
};

const createBook = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const response = await createBookService(body);
        res.status(201).send(response);
    } catch (err) {
        handleHttp(res, "Error creating book", 500, err);
    }
};

const updateBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    if (!id) {
        return handleHttp(res, "Id is required", 400);
    }

    if (!body || Object.keys(body).length === 0) {
        return handleHttp(res, "No data provided to update", 400);
    }

    try {
        const response = await updateBookService(id, body);

        if (!response) {
            return handleHttp(res, "Book not found", 404);
        }

        res.status(200).send({
            message: "Book successfully updated",
            updatedBook: response,
        });
    } catch (err) {
        handleHttp(res, "Error updating book", 500, err);
    }
};

export { getBook, getBooks, deleteBooks, createBook, updateBook };