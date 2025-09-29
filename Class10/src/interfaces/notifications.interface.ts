export interface INotification {
    id: number,
    type: string,
    message: string,
    read: boolean,
    createdAt: Date,
    userID: number
}
