import { Express } from "express";
import foldersController from "../controllers/folders.controller";
import auth from "../middlewares/auth.middlewares";
import { 
    checkForFileDuplication, 
    getRequestFile, 
    getFile, 
    checkForStorage, 
    checkForWritePermissions,
    checkForReadPermissions
} from "../middlewares/file.middlewares";

import {
    checkForFolderDuplication,
    getFolder
} from "../middlewares/folder.middlewares";

// const REMOVE_FOLDER = "/rmdir/:folderId";

// TODO add permission to folder
const GET_FOLDER = "/ls/:folderId";
const CREATE_FOLDER = "/mkdir/:folderId";
const MOVE_FILE = "/mv/:folderId/:fileId";
const REMOVE_FILE = "/rm/remove/:fileId";
const UPLOAD_FILE = "/upload/:folderId/";
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
    app.put(REMOVE_FILE,
        [
            auth.authenticate,
            getFile,
            checkForWritePermissions,
        ],
        foldersController.removeFileEndpoint);
    app.get(DOWNLOAD_FILE, 
        [
            auth.authenticate,
            getFile,
            // TODO
            // checkForReadPermissions
        ],
        foldersController.downloadEndpoint);
};

export default folderRoutes;
