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

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json(httpErrors(`Id: '${id}' is not valid`));
    }

    const folder = await db.Folder.findById(id)
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