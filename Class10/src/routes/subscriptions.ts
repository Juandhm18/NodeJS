import { Router ,type Request, type Response} from 'express';
import { getSubscriptions, getSubscriptionsByID, postSubscriptions, putSubscriptions, deleteSubscriptions } from '../controllers/subscriptions.controllers.js';

const router:Router = Router();

router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionsByID);
router.post("/", postSubscriptions);
router.put("/:id", putSubscriptions);
router.delete("/:id", deleteSubscriptions);

export { router };