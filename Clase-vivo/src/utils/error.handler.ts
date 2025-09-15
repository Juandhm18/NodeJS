import { type Response } from "express";
import { type HttpErrorStatus } from "../types/types.ts";

const handleHttp = (res:Response, error:string, code:HttpErrorStatus, details?:unknown) => {
    res.status(code).json({
        ok: false,
        error,
        ...(details? {details}:{})
    })
    res.send({ error })
}

export{ handleHttp }