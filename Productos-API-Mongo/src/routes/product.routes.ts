import { Router } from "express";
import { getProduct,
    getProductID,
    postProduct,
    putProduct,
    deleteProduct
 } from "../controllers/product.controllers";
 import { validateProduct } from "../middlewares/validateproducts";

 const router : Router = Router();

 router.get('/', getProduct);
 router.get('/:id', getProductID);
 router.post('/', validateProduct, postProduct);
 router.put('/:id', validateProduct, putProduct);
 router.delete('/:id', deleteProduct);

 export default router;