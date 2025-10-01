import { type Request, type Response } from "express";
import { getLoansService, getLoansByIDService, postLoansService, putLoansService, deleteLoansService } from "../services/loans.services.ts";

const getLoans = async (req:Request, res: Response): Promise<void> => {
    try {
        const loans = await getLoansService();
        res.send(loans);
    } catch (error) {
        res.status(500).send("Error retrieving loans");
    }
};

const getLoansByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const loan = await getLoansByIDService(Number(id));
        if (!loan) {
            res.status(404).send("Loan not found");
            return;
        };
        res.send(loan);
    } catch (error) {
        res.status(500).send("Error retrieving loan");
    }
};

const postLoans = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newLoan = req.body;
        if (!newLoan || !newLoan.loanDate || !newLoan.returnDate || !newLoan.actualReturnDate || !newLoan.status || !newLoan.bookID || !newLoan.borrowerID || !newLoan.ownerID) {
            res.status(400).send("Invalid loan data");
            return;
        };
        const loans = await getLoansService();
        if (loans.find(b => b.id === newLoan.id)) {
            res.status(400).send("Loan with this ID already exists");
            return;
        }
        const loan = await postLoansService(newLoan);
        res.send(loan);
    } catch (error) {
        res.status(500).send("Error creating loan");
    }
};

const putLoans = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedLoan = req.body;
        const loans = await getLoansByIDService(Number(id));
        if (!loans) {
            res.status(404).send("Loan not found");
            return;
        }
        const loan = await putLoansService(Number(id), updatedLoan);
        if (!loan) {
            res.status(404).send("Loan not found");
            return;
        }
        res.send(loan);
    } catch (error) {
        res.status(500).send("Error updating loan");
    }
};

const deleteLoans = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const loan = await getLoansByIDService(Number(id));
        if (!loan) {
            res.status(404).send("Loan not found");
            return;
        }
        const success = await deleteLoansService(Number(id));
        if (!success) {
            res.status(404).send("Loan not found");
            return;
        }
        res.send({ message: "Loan deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting loan");
    }
}

export { getLoans, getLoansByID, postLoans, putLoans, deleteLoans };