import { Express } from "express";
import adminsController from "../controllers/admins.controller";

const ADMIN_LOGIN = "/admin/login";

const adminRoutes = (app: Express) => {
    app.post(ADMIN_LOGIN, adminsController.loginEndpoint);
}

export default adminRoutes;