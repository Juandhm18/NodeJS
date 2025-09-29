export interface ILoan {
    id:number,
    loanDate:Date,
    returnDate:Date,
    actualReturnDate:Date | null,
    status:string,
    bookID:number,
    borrowerID:number,
    ownerID:number
}