import cron from "node-cron";
import { getLoansService } from "../services/loans.services.ts";
import { getUsersService } from "../services/users.services.ts";
import { getBooksService } from "../services/books.services.ts";
import { sendEmail } from "../services/email.services.ts";

cron.schedule("*/1 * * * *", async () => {
    try {
        const pastDue = (await getLoansService()).filter(loan => {
            const now = new Date();
            return loan.actualReturnDate === null && loan.returnDate < now;
        });
        const users = (await getUsersService()).filter(
            user => pastDue.some(loan => loan.borrowerID === user.id)
        );
        const books = (await getBooksService()).filter(
            book => pastDue.some(loan => loan.bookID === book.id)
        );

        for (const due of pastDue) {
            const borrower = users.find(user => user.id === due.borrowerID);
            const book = books.find(book => book.id === due.bookID);

            if (borrower && book) {
                const emailContent = `
                    <h1>Overdue Book Notification</h1>
                    <p>Dear ${borrower.name},</p>
                    <p>This is a reminder that the book <strong>${book.title}</strong> you borrowed is overdue.</p>
                    <p>Due Date: ${new Date(due.returnDate).toLocaleDateString()}</p>
                    <p>Please return it as soon as possible to avoid further penalties.</p>
                    <p>Thank you!</p>
                `;
                await sendEmail(emailContent, borrower.email);
                console.log(`[${new Date().toISOString()}] Se envió recordatorio a ${borrower.email} por el libro ${book.title}`);
            }
        }
    } catch (error) {
        console.error("Error fetching loans: ", error);
    }
})