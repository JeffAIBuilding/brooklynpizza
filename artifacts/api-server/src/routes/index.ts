import { Router, type IRouter } from "express";
import healthRouter from "./health";
import franchiseRouter from "./franchise";

const router: IRouter = Router();

router.use(healthRouter);
router.use(franchiseRouter);

export default router;
