export interface IBook {
    id:number,
    title:string,
    author:string,
    ISBN:string | null,
    genre:string,
    language:string,
    coverURL:string,
    description:string,
    status:string,
    createdAt:Date,
    ownerID:number
}
