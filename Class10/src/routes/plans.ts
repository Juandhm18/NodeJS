import { Router ,type Request, type Response} from 'express';
import { getPlans, getPlansByID, postPlans, putPlans, deletePlans } from '../controllers/plans.controllers.ts';

const router:Router = Router();

router.get("/", getPlans);
router.get("/:id", getPlansByID);
router.post("/", postPlans);
router.put("/:id", putPlans);
router.delete("/:id", deletePlans);

export { router };