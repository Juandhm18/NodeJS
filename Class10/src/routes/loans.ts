import { Router ,type Request, type Response} from 'express';
import { getLoans, getLoansByID, postLoans, putLoans, deleteLoans } from '../controllers/loans.controllers.js';

const router:Router = Router();

router.get("/", getLoans);
router.get("/:id", getLoansByID);
router.post("/", postLoans);
router.put("/:id", putLoans);
router.delete("/:id", deleteLoans);

export { router };