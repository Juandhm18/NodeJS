import { User } from "./users.models.ts";
import { Book } from "./books.models.ts";
import { BookCopy } from "./copies.models.ts";
import { Loan } from "./loans.models.ts";
import { Notification } from "./notifications.models.ts";
import { Review } from "./reviews.models.ts";

User.hasMany(Book, { foreignKey: "owner_id", as: "ownedBooks" });
Book.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

Book.hasMany(BookCopy, { foreignKey: "book_id", as: "copies" });
BookCopy.belongsTo(Book, { foreignKey: "book_id", as: "book" });

Book.hasMany(Review, { foreignKey: "book_id", as: "reviews" });
Review.belongsTo(Book, { foreignKey: "book_id", as: "book" });

User.hasMany(Review, { foreignKey: "reviewer_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "reviewer_id", as: "reviewer" });

User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

Book.hasMany(Loan, { foreignKey: "book_id", as: "loans" });
Loan.belongsTo(Book, { foreignKey: "book_id", as: "book" });

User.hasMany(Loan, { foreignKey: "borrower_id", as: "borrowedLoans" });
Loan.belongsTo(User, { foreignKey: "borrower_id", as: "borrower" });

User.hasMany(Loan, { foreignKey: "owner_id", as: "ownedLoans" });
Loan.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

export { User, Book, BookCopy, Loan, Notification, Review };
