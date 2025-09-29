import { type Request, type Response } from "express";
import { getUsersService, getUsersByIDService, postUsersService, putUsersService, deleteUsersService } from "../services/users.services.js";

const getUsers = async (req:Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersService();
        res.send(users);
    } catch (error) {
        res.status(500).send("Error retrieving users");
    }
};

const getUsersByID = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const user = await getUsersByIDService(Number(id));
        if (!user) {
            res.status(404).send("User not found");
            return;
        };
        res.send(user);
    } catch (error) {
        res.status(500).send("Error retrieving user");
    }
};

const postUsers = async ( req:Request, res: Response ): Promise<void> => {
    try {
        const newUser = req.body;
        if (!newUser || !newUser.name || !newUser.email || !newUser.password) {
            res.status(400).send("Invalid user data");
            return;
        };
        const users = await getUsersService();
        if (users.find(b => b.id === newUser.id)) {
            res.status(400).send("User with this ID already exists");
            return;
        }
        const user = await postUsersService(newUser);
        res.send(user);
    } catch (error) {
        res.status(500).send("Error creating user");
    }
};

const putUsers = async ( req:Request, res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        };
        const updatedUser = req.body;
        const users = await getUsersByIDService(Number(id));
        if (!users) {
            res.status(404).send("User not found");
            return;
        }
        const user = await putUsersService(Number(id), updatedUser);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Error updating user");
    }
};

const deleteUsers = async ( req:Request , res:Response ): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const user = await getUsersByIDService(Number(id));
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const success = await deleteUsersService(Number(id));
        if (!success) {
            res.status(404).send("User not found");
            return;
        }
        res.send({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Error deleting user");
    }
}

export { getUsers, getUsersByID, postUsers, putUsers, deleteUsers };