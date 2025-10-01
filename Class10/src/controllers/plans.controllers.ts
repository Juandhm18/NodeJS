import { type Request, type Response } from "express";
import { getPlansService, getPlansByIDService, postPlansService, putPlansService, deletePlansService } from "../services/plans.services.ts";

const getPlans = async (req:Request, res: Response): Promise<void> => {
    try {
        const plans = await getPlansService();
        res.send(plans);
    } catch (error) {
        res.status(500).send("Error retrieving plans");
    }
};

const getPlansByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const plan = await getPlansByIDService(Number(id));
        if (!plan) {
            res.status(404).send("Plan not found");
            return;
        };
        res.send(plan);
    } catch (error) {
        res.status(500).send("Error retrieving plan");
    }
};

const postPlans = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newPlan = req.body;
        if (!newPlan || !newPlan.name || !newPlan.price || !newPlan.bookLimit || !newPlan.description ) {
            res.status(400).send("Invalid plan data");
            return;
        };
        const plans = await getPlansService();
        if ( plans.find( p => p.id === newPlan.id )) {
            res.status(400).send("Plan with this ID already exists");
            return;
        }
        const plan = await postPlansService(newPlan);
        res.send(plan);
    } catch (error) {
        res.status(500).send("Error creating plan");
    }
};

const putPlans = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedPlan = req.body;
        const plans = await getPlansByIDService(Number(id));
        if (!plans) {
            res.status(404).send("Plan not found");
            return;
        }
        const plan = await putPlansService(Number(id), updatedPlan);
        if (!plan) {
            res.status(404).send("Plan not found");
            return;
        }
        res.send(plan);
    } catch (error) {
        res.status(500).send("Error updating plan");
    }
};

const deletePlans = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const plan = await getPlansByIDService(Number(id));
        if (!plan) {
            res.status(404).send("Plan not found");
            return;
        }
        const success = await deletePlansService(Number(id));
        if (!success) {
            res.status(404).send("Plan not found");
            return;
        }
        res.send({ message: "Plan deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting plan");
    }
}

export { getPlans, getPlansByID, postPlans, putPlans, deletePlans };