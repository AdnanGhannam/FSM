import env from "dotenv";
import express from "express";
import db from "./models/models";
import routes from "./routes/routes";
import userRoutes from "./routes/user.routes";
import planRoutes from "./routes/plan.routes";
import middlewares from "./middlewares/middlewares";
import adminRoutes from "./routes/admin.routes";
import folderRoutes from "./routes/folder.routes";

env.config();
db.config();

const app = express();
middlewares.config(app);

routes.config(app, 
    userRoutes, 
    adminRoutes,
    planRoutes,
    folderRoutes);

const { PORT } = process.env;
app.listen(PORT, () => {
    console.info(`Listening on port: ${PORT}`);
});
