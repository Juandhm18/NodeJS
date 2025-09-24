import cron from "node-cron";
import loans from "../data/loan.json";
import { sendReminder } from "./mailer";

function calculateDaysLate(dueDate: string) {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = today.getTime() - due.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

cron.schedule("* * * * *", async () => {
  const now = new Date().toISOString().split("T")[0];
  for (const loan of loans) {
    if (loan.dueDate < now) {
      const daysLate = calculateDaysLate(loan.dueDate);
      await sendReminder(loan.userEmail, loan.bookTitle, loan.dueDate, daysLate);
      console.log(
        `[${new Date().toLocaleString()}] Se envió recordatorio a ${loan.userEmail} por el libro ${loan.bookTitle}`
      );
    }
  }
});
