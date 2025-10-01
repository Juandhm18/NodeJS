import { Router ,type Request, type Response} from 'express';
import { getNotifications, getNotificationsByID, postNotifications, putNotifications, deleteNotifications } from '../controllers/notifications.controllers.ts';

const router:Router = Router();

router.get("/", getNotifications);
router.get("/:id", getNotificationsByID);
router.post("/", postNotifications);
router.put("/:id", putNotifications);
router.delete("/:id", deleteNotifications);

export { router };