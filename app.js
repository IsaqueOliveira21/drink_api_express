import dotenv from 'dotenv';
//import {resolve} from 'path';
import './src/database';

dotenv.config();

import express from 'express';
import userRoutes from './src/routes/userRoutes';
import drinkRegisterRoutes from './src/routes/drinkRegisterRoutes';

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/', userRoutes);
        this.app.use('/drinks', drinkRegisterRoutes);
    }
}

export default new App().app;