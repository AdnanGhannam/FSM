import { Types, Schema, model } from "mongoose";
import { USER } from "./User.model";

export const NOTIFICATION = "Notification";
export const NotificationTypes = ["storage", "user", "plan", "file"];

const create = () => {
    const notificationSchema = new Schema({
        user: {
            type: Types.ObjectId,
            ref: USER
        },
        type: {
            type: String,
            enum: NotificationTypes,
            required: true
        },
        linkTo: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    });

    const Notification = model(NOTIFICATION, notificationSchema);

    return Notification;
}

const notificationModel = { create };

export default notificationModel;