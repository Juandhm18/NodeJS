import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { type IReview } from "../interfaces/reviews.interface.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../models/reviews.json");

const getReviewsService = async (): Promise<IReview[]> => {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data) as IReview[];
};

const getReviewsByIDService = async ( id: number ): Promise<IReview | null> => {
    const reviews = await getReviewsService();
    const review = reviews.find( r => r.id === id );
    return review || null;
};

const postReviewsService = async ( newReview: IReview ): Promise<IReview> => {
    const reviews = await getReviewsService();
    reviews.push(newReview);
    await fs.writeFile(filepath, JSON.stringify(reviews, null, 4), "utf-8");
    return newReview;
};

const putReviewsService = async ( id:number, updatedReview: Partial<IReview> ): Promise<IReview | null> => {
    const reviews = await getReviewsService();
    const index = reviews.findIndex( r => r.id === id );
    if ( index === -1 ) {
        return null;
    }
    reviews[index] = { ...reviews[index], ...updatedReview, id } as IReview;
    await fs.writeFile(filepath, JSON.stringify(reviews, null, 4), "utf-8");
    return reviews[index];
};

const deleteReviewsService = async (id:number): Promise<boolean> => {
    const reviews = await getReviewsService();
    const index = reviews.findIndex( r => r.id === id );
    if ( index === -1 ) {
        return false;
    }
    reviews.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(reviews, null, 4), "utf-8");
    return true;
};

export { getReviewsService, getReviewsByIDService, postReviewsService, putReviewsService, deleteReviewsService };
