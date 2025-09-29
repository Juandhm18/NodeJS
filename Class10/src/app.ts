import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as booksRouter } from "./routes/books.js";
import { router as copiesRouter } from "./routes/copies.js";
import { router as loansRouter } from "./routes/loans.js";
import { router as notificationsRouter } from "./routes/notifications.js";
import { router as plansRouter } from "./routes/plans.js";
import { router as reviewsRouter } from "./routes/reviews.js";
import { router as subscriptionsRouter } from "./routes/subscriptions.js";
import { router as usersRouter } from "./routes/users.js";
import logger from "./middlewares/logger.js";
import "./jobs/minuteDue.job.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

app.use(logger);

app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/loans", loansRouter);
app.use("/notifications", notificationsRouter);
app.use("/plans", plansRouter);
app.use("/reviews", reviewsRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
