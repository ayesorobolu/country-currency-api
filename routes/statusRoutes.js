import express from "express";
import { getStatus } from "../controllers/statusController.js";

const statusRouter = express.Router();

statusRouter.get('/', getStatus); 

export default statusRouter;