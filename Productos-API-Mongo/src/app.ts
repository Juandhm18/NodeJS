import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes"
import dbconnection from "./database/dbconnection";


dotenv.config();

dbconnection();

const app = express();
app.use(express.json());
app.use (cors())

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;