import { Router } from "express";
import UserController from "../controllers/UserController";

import auth from "../middlewares/auth";

const router = new Router();

router.post('/login', UserController.login);
router.post('/create', UserController.create);
router.put('/update/:id', auth, UserController.update);

export default router;