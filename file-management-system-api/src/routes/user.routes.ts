import { Express } from "express";
import usersController from "../controllers/users.controller";

const LOGIN = "/login";
const REGISTER = "/register";

const userRoutes = (app: Express) => {
    app.post(LOGIN, usersController.loginEndpoint);
    app.post(REGISTER, usersController.registerEndpoint);
};

export default userRoutes;