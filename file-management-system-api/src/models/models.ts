import mongoose from "mongoose";
import folderPermissionModel from "./FolderPermission.model";
import userModel from "./User.model";
import folderModel from "./Folder.model";
import fileModel from "./File.model";
import planModel from "./Plan.model";
import paymentModel from "./Payment.model";
import planPaymentModel from "./PlanPayment.model";
import notificationModel from "./Notification.model";
import userPlanModel from "./UserPlan.model";
import adminModel from "./Admin.model";

/**
 * Make sure to call `env.config()` before this function
 */
const config = async () => {
    const { DB_HOST: HOST, DB_NAME: NAME, DB_PORT: PORT } = process.env;

    if (!HOST || !NAME || !PORT) {
        console.error("APPLICATION ERROR:", `HOST, NAME and PORT fields are required in dotenv file!`);
        process.exit(1);
    }

    try {
        await mongoose.connect(`mongodb://${HOST}:${PORT}/${NAME}`);
        console.info(`MongoDB connected on port: ${PORT}`);
    } catch(err) {
        console.error("DATABASE ERROR:", err);
        process.exit(1);
    }
};

const db = {
    config,
    User: userModel.create(),
    Admin: adminModel.create(),
    Folder: folderModel.create(),
    File: fileModel.create(),
    Plan: planModel.create(),
    UserPlan: userPlanModel.create(),
    Payment: paymentModel.create(),
    PlanPayment: planPaymentModel.create(),
    Notification: notificationModel.create(),
    FolderPermission: folderPermissionModel.create()
};

export default db;