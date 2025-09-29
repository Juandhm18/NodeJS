import { type Request, type Response } from "express";
import { getCopiesByIDService, getCopiesService, postCopiesService, putCopiesService, deleteCopiesService } from "../services/copies.services.js";
import { get } from "http";

const getCopies = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const copies = await getCopiesService();
        res.send(copies);
    } catch (error) {
        res.status(500).send("Error retrieving copies");
    }
};

const getCopiesByID = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const copy = await getCopiesByIDService(Number(id));
        if (!copy) {
            res.status(404).send("Copy not found");
            return;
        };
        res.send(copy);
    } catch (error) {
        res.status(500).send("Error retrieving copy");
    }
};

const postCopies = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const newCopy = req.body;
        if (!newCopy || !newCopy.condition || !newCopy.availability || !newCopy.bookID) {
            res.status(400).send("Invalid copy data");
            return;
        }
        const copies = await getCopiesService();
        if ( copies.find( c => c.id === newCopy.id ) ) {
            res.status(400).send("Copy with this ID already exists");
            return;
        }
        const copy = await postCopiesService(newCopy);
        res.send(copy);
    } catch (error) {
        res.status(500).send("Error creating copy");
    }
};

const putCopies = async ( req:Request, res:Response ): Promise<void> => {
    try{
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const updatedBook = req.body;
        const copies = await getCopiesByIDService(Number(id));
        if (!copies) {
            res.status(404).send("Copy not found");
            return;
        }
        const copy = await putCopiesService(Number(id), updatedBook);
        if (!copy) {
            res.status(404).send("Copy not found");
            return;
        }
        res.send(copy);
    } catch (error) {
        res.status(500).send("Error updating copy");
    }
};

const deleteCopies = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const copy = await getCopiesByIDService(Number(id));
        if (!copy) {
            res.status(404).send("Copy not found");
            return;
        }
        const success = await deleteCopiesService(Number(id));
        if (!success) {
            res.status(404).send("Copy not found");
            return;
        }
        res.send({ message: "Copy deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting copy");
    }
}

export { getCopies, getCopiesByID, postCopies, putCopies, deleteCopies };