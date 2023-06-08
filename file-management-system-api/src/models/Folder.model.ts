import { Types, Schema, model } from "mongoose";
import { USER } from "./User.model";
import { FOLDER_PERMISSION } from "./FolderPermission.model";
import { FILE } from "./File.model";

export const FOLDER = "Folder";
export const Visibilities = ["private", "public", "custom"];

const create = () => {
    const folderSchema = new Schema({
        owner: {
            type: Types.ObjectId,
            ref: USER
        },
        name: {
            type: String,
            match: /^(\w+\.?)*\w+$/,
            required: true,
            maxlength: 30
        },
        parentFolder: {
            type: Types.ObjectId,
            ref: FOLDER,
        },
        path: {
            type: String,
            required: true
        },
        visibility: {
            type: String,
            enum: Visibilities,
            default: Visibilities[0]
        },
        visibleTo: [{
            type: Types.ObjectId,
            ref: USER
        }],
        usersPermissions: [{
            type: Types.ObjectId,
            ref: FOLDER_PERMISSION
        }],
        subFolders: [{
            type: Types.ObjectId,
            ref: FOLDER
        }],
        subFiles: [{
            type: Types.ObjectId,
            ref: FILE
        }]
    });

    const Folder = model(FOLDER, folderSchema);

    return Folder;
}

const folderModel = { create };

export default folderModel;
