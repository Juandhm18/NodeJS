import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { type IPlan } from "../interfaces/plans.interface.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../models/plans.json");

const getPlansService = async (): Promise<IPlan[]> => {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data) as IPlan[];
};

const getPlansByIDService = async ( id: number ): Promise<IPlan | null> => {
    const plans = await getPlansService();
    const plan = plans.find( p => p.id === id );
    return plan || null;
};

const postPlansService = async ( newPlan: IPlan ): Promise<IPlan> => {
    const plans = await getPlansService();
    plans.push(newPlan);
    await fs.writeFile(filepath, JSON.stringify(plans, null, 4), "utf-8");
    return newPlan;
};

const putPlansService = async ( id:number, updatedPlan: Partial<IPlan> ): Promise<IPlan | null> => {
    const plans = await getPlansService();
    const index = plans.findIndex( p => p.id === id );
    if ( index === -1 ) {
        return null;
    }
    plans[index] = { ...plans[index], ...updatedPlan, id } as IPlan;
    await fs.writeFile(filepath, JSON.stringify(plans, null, 4), "utf-8");
    return plans[index];
};

const deletePlansService = async (id:number): Promise<boolean> => {
    const plans = await getPlansService();
    const index = plans.findIndex( p => p.id === id );
    if ( index === -1 ) {
        return false;
    }
    plans.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(plans, null, 4), "utf-8");
    return true;
};

export { getPlansService, getPlansByIDService, postPlansService, putPlansService, deletePlansService };
