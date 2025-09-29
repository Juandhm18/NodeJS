import { type Request, type Response } from "express";
import { getSubscriptionsService, getSubscriptionsByIDService, postSubscriptionsService, putSubscriptionsService, deleteSubscriptionsService } from "../services/subscriptions.services.js";

const getSubscriptions = async (req:Request, res: Response): Promise<void> => {
    try {
        const subscriptions = await getSubscriptionsService();
        res.send(subscriptions);
    } catch (error) {
        res.status(500).send("Error retrieving subscriptions");
    }
};

const getSubscriptionsByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const subscription = await getSubscriptionsByIDService(Number(id));
        if (!subscription) {
            res.status(404).send("Subscription not found");
            return;
        };
        res.send(subscription);
    } catch (error) {
        res.status(500).send("Error retrieving subscription");
    }
};

const postSubscriptions = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newSubscription = req.body;
        if (!newSubscription || !newSubscription.userID || !newSubscription.bookID || !newSubscription.startDate || !newSubscription.endDate) {
            res.status(400).send("Invalid subscription data");
            return;
        };
        const subscriptions = await getSubscriptionsService();
        if ( subscriptions.find( r => r.id === newSubscription.id ) ) {
            res.status(400).send("Subscription with this ID already exists");
            return;
        }
        const subscription = await postSubscriptionsService(newSubscription);
        res.send(subscription);
    } catch (error) {
        res.status(500).send("Error creating subscription");
    }
};

const putSubscriptions = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedSubscription = req.body;
        const subscriptions = await getSubscriptionsByIDService(Number(id));
        if (!subscriptions) {
            res.status(404).send("Subscription not found");
            return;
        }
        const subscription = await putSubscriptionsService(Number(id), updatedSubscription);
        if (!subscription) {
            res.status(404).send("Subscription not found");
            return;
        }
        res.send(subscription);
    } catch (error) {
        res.status(500).send("Error updating subscription");
    }
};

const deleteSubscriptions = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const subscription = await getSubscriptionsByIDService(Number(id));
        if (!subscription) {
            res.status(404).send("Subscription not found");
            return;
        }
        const success = await deleteSubscriptionsService(Number(id));
        if (!success) {
            res.status(404).send("Subscription not found");
            return;
        }
        res.send({ message: "Subscription deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting subscription");
    }
}

export { getSubscriptions, getSubscriptionsByID, postSubscriptions, putSubscriptions, deleteSubscriptions };