import { type ISubscription } from '../interfaces/subscriptions.interface.js';
import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "../models/subscriptions.json");

const getSubscriptionsService = async (): Promise<ISubscription[]> => {
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data) as ISubscription[];
};

const getSubscriptionsByIDService = async ( id:number ): Promise<ISubscription | null> => {
    const subscriptions = await getSubscriptionsService();
    const subscription = subscriptions.find( s => s.id === id );
    return subscription || null;
}

const postSubscriptionsService = async ( newSubscription: ISubscription ): Promise<ISubscription> => {
    const subscriptions = await getSubscriptionsService();
    subscriptions.push(newSubscription);
    await fs.writeFile(filepath, JSON.stringify(subscriptions, null, 4), "utf-8");
    return newSubscription;
};

const putSubscriptionsService = async ( id:number, updatedSubscription: Partial<ISubscription> ): Promise<ISubscription | null> => {
    const subscriptions = await getSubscriptionsService();
    const index = subscriptions.findIndex( s => s.id === id );
    if ( index === -1 ) {
        return null;
    }
    subscriptions[index] = { ...subscriptions[index], ...updatedSubscription, id } as ISubscription;
    await fs.writeFile(filepath, JSON.stringify(subscriptions, null, 4), "utf-8");
    return subscriptions[index];
};

const deleteSubscriptionsService = async (id:number): Promise<boolean> => {
    const subscriptions = await getSubscriptionsService();
    const index = subscriptions.findIndex( s => s.id === id);
    if ( index === -1 ) {
        return false;
    }
    subscriptions.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(subscriptions, null, 4), "utf-8");
    return true;
};

export { getSubscriptionsService, getSubscriptionsByIDService, postSubscriptionsService, putSubscriptionsService, deleteSubscriptionsService };