import express from "express";
const router = express.Router();
import { createUser, getAllUsers } from "../controllers/userController.js";

// POST /api/users
router.post("/", createUser);
// GET /api/users 
router.get("/", getAllUsers);
export default router;
