import express from "express";
import { signup, login, googleAuth, searchUsers } from "../../Controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/google-auth", googleAuth);
authRoutes.post("/search", searchUsers);

export default authRoutes;
