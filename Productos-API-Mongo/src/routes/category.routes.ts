import { Router } from 'express'
import { getCategory, 
    getCategoryID, 
    createCategory, 
    putCategory, 
    deleteCategory 
} from '../controllers/category.controllers'


const router:Router = Router()

router.get('/', getCategory);       // GET /categories
router.get('/:id', getCategoryID); // GET /categories/:id
router.post('/', createCategory);   // POST /categories
router.put('/:id', putCategory);    // PUT /categories/:id
router.delete('/:id', deleteCategory); // DELETE /categories/:id

export default router;

