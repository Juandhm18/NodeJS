import { Router ,type Request, type Response} from 'express';
import { deleteBooks, getBooks, getBooksByID, postBooks, putBooks } from '../controllers/books.controllers.js';
import auth from '../middlewares/auth.js';
import autor from '../middlewares/autor.ts';

const router:Router = Router();

router.get("/", getBooks);
router.get("/:id", getBooksByID);
router.post("/", auth, autor, postBooks);
router.put("/:id", auth, putBooks);
router.delete("/:id", auth, deleteBooks);

export { router };