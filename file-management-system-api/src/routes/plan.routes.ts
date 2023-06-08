import { Express } from "express";
import plansController from "../controllers/plans.controller";
import auth from "../middlewares/auth.middlewares";

const CREATE_PLAN = "/plans";

const planRoutes = (app: Express) => {
    app.post(CREATE_PLAN, 
        [auth.authenticate, auth.authorizeAdmin],
        plansController.createEndpoint);
};

export default planRoutes;