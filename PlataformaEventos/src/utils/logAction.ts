import { Log } from "../models/log.model";

export const logAction = async (
    action: string,
    userId: number,
    source: string
) => {
    try {
        await Log.create({ action, userId, source });        
    } catch (error) {
        console.error("Error al guardar log:", error);
    }
};