import { Types, Schema, model } from "mongoose";
import { FOLDER } from "./Folder.model";
import { NOTIFICATION } from "./Notification.model";
import { USER_PLAN } from "./UserPlan.model";
import db from "./models";
import fs from "fs";
import path, { dirname } from "path";

export const USER = "User";

const create = () => {
    const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 20
        },
        email: {
            type: String,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 10 
        },
        joinedAt: {
            type: Number,
            immutable: true,
            default: Date.now()
        },
        rootFolder: {
            type: Types.ObjectId,
            ref: FOLDER
        },
        notifications: [{
            type: Types.ObjectId,
            ref: NOTIFICATION
        }],
        currentPlan: {
            type: Types.ObjectId,
            ref: USER_PLAN
        },
        usage: {
            type: Number,
            default: 0
        }
    });

    userSchema.methods.toJSON = function() {
        const user = this;
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
    }

    userSchema.pre("save", async function(next) {
        if (this.isNew) {
            try {
                const folderName = this.name + "_" + this.id;

                const folder = await db.Folder.create({ 
                    owner: this.id,
                    name: folderName,
                    path: path.normalize("/storage"),
                    visibility: "private"
                });
                this.rootFolder = folder.id;

                const projDir = dirname(require.main!.filename);
                const folderPath = path.join(projDir, folder.path, folderName);

                fs.mkdir(folderPath, { recursive: true }, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });

                next();
            } catch (error) {
                console.error("MongoDB ERROR:", error);
                return;
            }
        }

        next();
    });

    const User = model(USER, userSchema);

    return User;
}

const userModel = { create };

export default userModel;
