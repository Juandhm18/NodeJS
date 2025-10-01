import { type Request, type Response } from "express";
import { getNotificationsService, getNotificationsByIDService, postNotificationsService, putNotificationsService, deleteNotificationsService } from "../services/notifications.services.ts";

const getNotifications = async (req:Request, res: Response): Promise<void> => {
    try {
        const notifications = await getNotificationsService();
        res.send(notifications);
    } catch (error) {
        res.status(500).send("Error retrieving notifications");
    }
};

const getNotificationsByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const notification = await getNotificationsByIDService(Number(id));
        if (!notification) {
            res.status(404).send("Notification not found");
            return;
        };
        res.send(notification);
    } catch (error) {
        res.status(500).send("Error retrieving notification");
    }
};

const postNotifications = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newNotification = req.body;
        if (!newNotification || !newNotification.type || !newNotification.message || !newNotification.read || !newNotification.createdAt || !newNotification.userID) {
            res.status(400).send("Invalid notification data");
            return;
        };
        const notifications = await getNotificationsService();
        if (notifications.find(n => n.id === newNotification.id)) {
            res.status(400).send("Notification with this ID already exists");
            return;
        }
        const notification = await postNotificationsService(newNotification);
        res.send(notification);
    } catch (error) {
        res.status(500).send("Error creating notification");
    }
};

const putNotifications = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedNotification = req.body;
        const notifications = await getNotificationsByIDService(Number(id));
        if (!notifications) {
            res.status(404).send("Notification not found");
            return;
        }
        const notification = await putNotificationsService(Number(id), updatedNotification);
        if (!notification) {
            res.status(404).send("Notification not found");
            return;
        }
        res.send(notification);
    } catch (error) {
        res.status(500).send("Error updating notification");
    }
};

const deleteNotifications = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const notification = await getNotificationsByIDService(Number(id));
        if (!notification) {
            res.status(404).send("Notification not found");
            return;
        }
        const success = await deleteNotificationsService(Number(id));
        if (!success) {
            res.status(404).send("Notification not found");
            return;
        }
        res.send({ message: "Notification deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting notification");
    }
}

export { getNotifications, getNotificationsByID, postNotifications, putNotifications, deleteNotifications };