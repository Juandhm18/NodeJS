export interface IReview {
    id: number,
    rating: number,
    comment: string,
    createdAt: Date,
    bookID: number,
    userID: number
}