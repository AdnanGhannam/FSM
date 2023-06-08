import { Express } from "express"
import { httpErrors } from "../controllers/helpers";

type ConfigurableRoute = (app: Express) => void

const config = (app: Express, ...routes: ConfigurableRoute[]) => {
    routes.forEach(route => route(app));
    app.all("*", 
        (req, res) => res.status(404).json(httpErrors(`Can't '${req.method}' on: '${req.url}'`)));
};

const routes = { config };

export default routes;