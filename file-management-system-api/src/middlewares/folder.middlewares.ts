import path from "path";
import fs from "fs";
import { RequestHandler } from "express";
import { httpErrors } from "../controllers/helpers";
import { Types } from "mongoose";
import db from "../models/models";

export const getStorage = (dirname: string, basename: string) => {
    return path.join(dirname, basename);
}

export const getDirSize = (dirPath: string) => {
    let size = 0;
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i]);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            size += stats.size;
        } else if (stats.isDirectory()) {
            size += getDirSize(filePath);
        }
    }
    return size;
};

/**
 *  { folder, path }
 */
export const getFolder: RequestHandler = async (req, res, next) => {
    const { folderId: id } = req.params as any;

    if (!id) {
        // get file's parent folder
        const { file } = res.locals;
        res.locals.folder = file.parentFolder;

        next();
        return;
    }

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json(httpErrors(`Id: '${id}' is not valid`));
    }

    const folder = await db.Folder.findById(id)
        .populate("usersPermissions")
        .populate("parentFolder")
        .populate("subFolders")
        .populate("subFiles");

    if (!folder) {
        return res.status(404)
            .json(httpErrors(`Folder with Id: '${id}' is not found`));
    }

    res.locals.folder = folder;
    res.locals.path = getStorage(folder.path, folder.name);
    next();
};

export const checkForFolderDuplication: RequestHandler = async (req, res, next) => {
    const { path: newfolderPath } = res.locals;
    const { name } = req.body;

    if (!name) {
        return res.status(400)
            .json(httpErrors("The 'name' field is required"));
    }

    const existedFolder = await db.Folder.findOne({ name, path: newfolderPath });

    if (existedFolder) {
        return res.status(400)
            .json(httpErrors(`Duplicated file name: '${name}'`));
    }

    next();
};

export const checkForReadPermissions: RequestHandler = async (req, res, next) => {
    const { user, folder } = res.locals;

    if (user.id == folder.owner) {
        next();
        return;
    }

    const folderPermission = await db.FolderPermission.findOne({ user: user.id, folder: folder.id });

    if (!folderPermission) {
        return res.status(403)
            .json(httpErrors("You don't have access to this folder"));
    }

    next();
};

export const checkForWritePermissions: RequestHandler = async (req, res, next) => {
    const { user, folder } = res.locals;

    if (user.id == folder.owner) {
        next();
        return;
    }

    const folderPermission = await db.FolderPermission.findOne({ user: user.id, folder: folder.id });

    if (!folderPermission) {
        return res.status(403)
            .json(httpErrors("You don't have access to this folder"));
    }

    if (folderPermission.permissions == "read") {
        return res.status(401)
            .json(httpErrors("You can't write on this folder"));
    }

    next();
};
