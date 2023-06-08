import { model, Types, Schema } from 'mongoose';
import { USER } from './User.model';
import { FOLDER } from './Folder.model';

export const FOLDER_PERMISSION = "FolderPermission";
export const Permissions = ["read", "read-write"];

const create = () => {
    const folderPermissionSchema = new Schema({
        user: {
            type: Types.ObjectId,
            ref: USER,
            required: true
        },
        folder: {
            type: Types.ObjectId,
            ref: FOLDER,
            required: true
        },
        permissions: {
            type: String,
            enum: Permissions
        }
    });

    const FolderPermission = model(FOLDER_PERMISSION, folderPermissionSchema);

    return FolderPermission;
}

const folderPermissionModel = { create };

export default folderPermissionModel;