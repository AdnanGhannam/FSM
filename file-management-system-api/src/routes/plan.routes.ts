import { Express } from "express";
import plansController from "../controllers/plans.controller";
import auth from "../middlewares/auth.middlewares";
import { checkForPayment, getPlan } from "../middlewares/plan.middlewares";

const GET_PLANS = "/plans";
const CREATE_PLAN = "/plans";
const UPGRADE_To = "/plans/:planId";

const planRoutes = (app: Express) => {
    app.get(GET_PLANS, 
        plansController.getAllEndpoint);
    app.post(CREATE_PLAN, 
        [auth.authenticate, auth.authorizeAdmin],
        plansController.createEndpoint);
    app.post(UPGRADE_To,
        [
            auth.authenticate,
            getPlan,
            checkForPayment
        ],
        plansController.upgradeToEndpoint);
};

export default planRoutes;