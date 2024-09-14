import { Router } from "express";
import DrinkRegisterController from '../controllers/DrinkRegisterController';

import auth from "../middlewares/auth";

const router = new Router();

router.get('/index', auth, DrinkRegisterController.index);
router.get('/ranking/month', auth, DrinkRegisterController.monthRanking);
router.get('/ranking/year', auth, DrinkRegisterController.yearRanking);
router.post('/create', auth, DrinkRegisterController.create);
router.put('/update/:id', auth, DrinkRegisterController.update);
router.delete('/delete/:id', auth, DrinkRegisterController.delete);

export default router;
