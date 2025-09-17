import type { NextFunction, Request, Response } from "express";

export function validateUserData(req: Request, res: Response, next: NextFunction) {
    console.log("🔍 Validating user data...");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Body type:", typeof req.body);


    if (!req.body) {
        return res.status(400).json({
            error: "Request body is missing. Make sure to send JSON data with Content-Type: application/json",
        });
    }

    const { name, role } = req.body;


    if (!name || !role) {
        return res.status(400).json({
            error: "Missing required fields: 'name' and 'role' are required",
            received: { name, role }
        });
    }

    if (typeof name !== "string" || typeof role !== "string") {
        return res.status(400).json({
            error: "Invalid data: 'name' and 'role' must be strings",
            received: { name: typeof name, role: typeof role }
        });
    }


    if (name.trim().length < 2) {
        return res.status(400).json({
            error: "Name must be at least 2 characters long"
        });
    }


    const allowedRoles = ['admin', 'user', 'moderator', 'guest'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            error: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
            received: role
        });
    }

    console.log("User data validation passed");
    next();
}

export function checkPermissions(req: Request, res: Response, next: NextFunction) {
    console.log(" Checking permissions...");
    const { role } = req.body;

    if (role !== "admin") {
        console.log(" Permission denied - role is not admin");
        return res.status(403).json({
            error: "Forbidden: only admin users can create new users",
            requiredRole: "admin",
            receivedRole: role
        });
    }

    console.log("✅ Permission check passed - user is admin");
    next();
}


export function validateUserUpdate(req: Request, res: Response, next: NextFunction) {
    console.log("🔍 Validating user update...");

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "No data provided to update"
        });
    }

    const { name, role } = req.body;


    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
        return res.status(400).json({
            error: "Name must be a string with at least 2 characters"
        });
    }

    if (role !== undefined) {
        const allowedRoles = ['admin', 'user', 'moderator', 'guest'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                error: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
            });
        }
    }

    console.log("✅ User update validation passed");
    next();
}