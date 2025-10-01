import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { type ICopy } from "../interfaces/copies.interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../modules/copies.json");

const getCopiesService = async (): Promise<ICopy[]> => {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data) as ICopy[];
};

const getCopiesByIDService = async (id:number): Promise<ICopy | null> => {
    const copies = await getCopiesService();
    const copy = copies.find( c => c.id === id );
    return copy || null;
};

const postCopiesService = async (newCopy: ICopy): Promise<ICopy> => {
    const copies = await getCopiesService();
    copies.push(newCopy);
    await fs.writeFile(filepath, JSON.stringify(copies, null, 4), "utf-8");
    return newCopy;
};

const putCopiesService = async (id:number, updatedCopy: Partial<ICopy>): Promise<ICopy | null> => {
    const copies = await getCopiesService();
    const index = copies.findIndex( c => c.id === id);
    if ( index === -1 ) {
        return null;
    }
    copies[index] = { ...copies[index], ...updatedCopy, id } as ICopy;
    await fs.writeFile(filepath, JSON.stringify(copies, null, 4), "utf-8");
    return copies[index];
};

const deleteCopiesService = async (id:number): Promise<boolean> => {
    const copies = await getCopiesService();
    const index = copies.findIndex( c => c.id === id);
    if ( index === -1 ) {
        return false;
    }
    copies.splice(index,1);
    await fs.writeFile(filepath, JSON.stringify(copies, null, 4), "utf-8");
    return true;
};

export { getCopiesService, getCopiesByIDService, postCopiesService, putCopiesService, deleteCopiesService };