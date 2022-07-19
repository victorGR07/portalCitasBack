import express from "express";
import HomeRoutes from "./home";

const router = express.Router();
router.use("/", HomeRoutes);

export default router;