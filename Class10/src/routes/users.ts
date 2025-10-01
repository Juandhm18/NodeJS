import { Router ,type Request, type Response} from 'express';
import { getUsers, getUsersByID, postUsers, putUsers, deleteUsers } from '../controllers/users.controllers.ts';

const router:Router = Router();

router.get("/", getUsers);
router.get("/:id", getUsersByID);
router.post("/", postUsers);
router.put("/:id", putUsers);
router.delete("/:id", deleteUsers);

export { router };