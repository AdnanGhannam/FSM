import { Express } from "express";
import foldersController from "../controllers/folders.controller";
import auth from "../middlewares/auth.middlewares";
import { 
    checkForFileDuplication, 
    getRequestFile, 
    getFile, 
    checkForStorage, 
} from "../middlewares/file.middlewares";

import {
    checkForFolderDuplication,
    getFolder,
    checkForWritePermissions,
    checkForReadPermissions,
} from "../middlewares/folder.middlewares";

const GET_FOLDER = "/ls/:folderId";
const UPLOAD_FILE = "/upload/:folderId/";
const CREATE_FOLDER = "/mkdir/:folderId";
const REMOVE_FOLDER = "/rmdir/:folderId";
const UPDATE_FOLDER_PERMISSIONS = "/chmod/:folderId";
const REMOVE_FILE = "/rm/:fileId";
const MOVE_FILE = "/mv/:folderId/:fileId";
const DOWNLOAD_FILE = "/download/:fileId";

const folderRoutes = (app: Express) => {
    app.get(GET_FOLDER, 
        [
            getFolder
        ],
        foldersController.getEndpoint);
    app.post(CREATE_FOLDER, 
        [
            auth.authenticate, 
            getFolder, 
            checkForWritePermissions,
            checkForFolderDuplication
        ],
        foldersController.createFolderEndpoint);
    app.post(UPLOAD_FILE, 
        [
            auth.authenticate, 
            getRequestFile, 
            getFolder, 
            checkForWritePermissions, 
            checkForStorage,
            checkForFileDuplication
        ],
        foldersController.uploadFileEndpoint);
    app.put(MOVE_FILE,
        [
            auth.authenticate,
            getFile,
            getFolder,
            checkForWritePermissions,
            checkForStorage,
            checkForFileDuplication
        ],
        foldersController.moveFileEndpoint);
    app.delete(REMOVE_FILE,
        [
            auth.authenticate,
            getFile,
            getFolder,
            checkForWritePermissions,
        ],
        foldersController.removeFileEndpoint);
    app.delete(REMOVE_FOLDER,
        [
            auth.authenticate,
            getFolder,
            checkForWritePermissions
        ],
        foldersController.removeFolderEndpoint);
    app.get(DOWNLOAD_FILE, 
        [
            auth.authenticate,
            getFile,
            getFolder,
            checkForReadPermissions
        ],
        foldersController.downloadEndpoint);
    app.put(UPDATE_FOLDER_PERMISSIONS,
        [
            auth.authenticate,
            getFolder
        ],
        foldersController.updateFolderPermissionsEndpoint);
};

export default folderRoutes;
