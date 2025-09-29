import { Router ,type Request, type Response} from 'express';
import { getReviews, getReviewsByID, postReviews, putReviews, deleteReviews } from '../controllers/reviews.controllers.js';

const router:Router = Router();

router.get("/", getReviews);
router.get("/:id", getReviewsByID);
router.post("/", postReviews);
router.put("/:id", putReviews);
router.delete("/:id", deleteReviews);

export { router };