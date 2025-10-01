import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as booksRouter } from "./routes/books.ts";
import { router as copiesRouter } from "./routes/copies.ts";
import { router as loansRouter } from "./routes/loans.ts";
import { router as notificationsRouter } from "./routes/notifications.ts";
import { router as plansRouter } from "./routes/plans.ts";
import { router as reviewsRouter } from "./routes/reviews.ts";
import { router as subscriptionsRouter } from "./routes/subscriptions.ts";
import { router as usersRouter } from "./routes/users.ts";
import logger from "./middlewares/logger.ts";
import "./jobs/minuteDue.job.ts";

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
