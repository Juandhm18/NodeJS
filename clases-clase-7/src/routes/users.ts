import { Router, type Request, type Response } from "express"
import { checkPermissions, validateUserData } from "../middlewares/validateUser.ts"
import {
    getUsersWithoutStreams,
    getUsersWithStreams,
    streamUsersToClient,
    uploadUsersStream,
} from "../controllers/users.ts"
import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} from "../services/users.service.ts"
import { randomUUID } from "crypto"

const router: Router = Router()

/**
 * http://localhost:3002/users
 */

// 🔹 Métodos con streams primero (para evitar conflicto con /:id)
router.get("/without-streams", getUsersWithoutStreams)
router.get("/with-streams", getUsersWithStreams)
router.get("/stream-to-client", streamUsersToClient)
router.post("/upload-stream", uploadUsersStream)

// 🔹 Comparativa de rendimiento
router.get("/performance-test", async (req: Request, res: Response) => {
    const initialMemory = process.memoryUsage().heapUsed
    const startTime = Date.now()

    res.json({
        message: "Performance test endpoints available",
        initialMemory: `${Math.round(initialMemory / 1024 / 1024)}MB`,
        startTime,
        endpoints: {
            traditional: "/users/without-streams",
            streaming: "/users/with-streams",
            realtime: "/users/stream-to-client",
        },
        tips: [
            "Usa /without-streams para archivos pequeños",
            "Usa /with-streams para archivos grandes",
            "Usa /stream-to-client para respuestas en tiempo real",
        ],
    })
})

// 🔹 CRUD clásico con middlewares mejorados

// Crear usuario (con validaciones)
router.post(
    "/",
    validateUserData,
    checkPermissions,
    async (req: Request, res: Response) => {
        try {
            const { name, role } = req.body
            const newUser = await createUser({ name, role }) // No necesitas pasar id
            res.status(201).json({
                message: "User created successfully",
                user: newUser,
            })
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({
                message: "Error creating user",
                error: error instanceof Error ? error.message : "Unknown error"
            })
        }
    }
)


router.get("/", async (req: Request, res: Response) => {
    const users = await getUsers()
    res.json(users)
})

// Obtener uno por id
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const user = await getUser(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
})


router.put("/:id",
    validateUserData, // Nuevo middleware
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const updated = await updateUser(req.params.id, req.body)
            if (!updated) return res.status(404).json({ message: "User not found" })
            res.json({
                message: "User updated successfully",
                user: updated
            })
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({
                message: "Error updating user",
                error: error instanceof Error ? error.message : "Unknown error"
            })
        }
    }
)


router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const ok = await deleteUser(req.params.id)
    if (!ok) return res.status(404).json({ message: "User not found" })
    res.status(204).send()
})

export { router }