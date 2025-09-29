import { Router ,type Request, type Response} from 'express';
import { getCopies, getCopiesByID, postCopies, putCopies, deleteCopies } from '../controllers/copies.controllers.js';

const router:Router = Router();

router.get("/", getCopies);
router.get("/:id", getCopiesByID);
router.post("/", postCopies);
router.put("/:id", putCopies);
router.delete("/:id", deleteCopies);

export { router };