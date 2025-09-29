import { type Request, type Response } from "express";
import { getReviewsService, getReviewsByIDService, postReviewsService, putReviewsService, deleteReviewsService } from "../services/reviews.services.js";

const getReviews = async (req:Request, res: Response): Promise<void> => {
    try {
        const reviews = await getReviewsService();
        res.send(reviews);
    } catch (error) {
        res.status(500).send("Error retrieving reviews");
    }
};

const getReviewsByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const review = await getReviewsByIDService(Number(id));
        if (!review) {
            res.status(404).send("Review not found");
            return;
        };
        res.send(review);
    } catch (error) {
        res.status(500).send("Error retrieving review");
    }
};

const postReviews = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newReview = req.body;
        if (!newReview || !newReview.rating || !newReview.comment || !newReview.createdAt || !newReview.bookID || !newReview.userID) {
            res.status(400).send("Invalid review data");
            return;
        };
        const reviews = await getReviewsService();
        if ( reviews.find( r => r.id === newReview.id ) ) {
            res.status(400).send("Review with this ID already exists");
            return;
        }
        const review = await postReviewsService(newReview);
        res.send(review);
    } catch (error) {
        res.status(500).send("Error creating review");
    }
};

const putReviews = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedReview = req.body;
        const reviews = await getReviewsByIDService(Number(id));
        if (!reviews) {
            res.status(404).send("Review not found");
            return;
        }
        const review = await putReviewsService(Number(id), updatedReview);
        if (!review) {
            res.status(404).send("Review not found");
            return;
        }
        res.send(review);
    } catch (error) {
        res.status(500).send("Error updating review");
    }
};

const deleteReviews = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const review = await getReviewsByIDService(Number(id));
        if (!review) {
            res.status(404).send("Review not found");
            return;
        }
        const success = await deleteReviewsService(Number(id));
        if (!success) {
            res.status(404).send("Review not found");
            return;
        }
        res.send({ message: "Review deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting review");
    }
}

export { getReviews, getReviewsByID, postReviews, putReviews, deleteReviews };