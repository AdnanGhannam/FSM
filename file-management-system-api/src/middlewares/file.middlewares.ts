import path from "path";
import fs from 'fs';
import db from "../models/models";
import { RequestHandler } from "express";
import { httpErrors } from "../controllers/helpers";
import { UploadedFile } from "express-fileupload";
import mime from "mime";
import { Types } from "mongoose";
import { Visibilities } from "../models/Folder.model";

// export const getPathDetails = (folderPath: string) => {
//     const dirname = "/storage" + (path.dirname(folderPath) === '.' ? '' : path.dirname(folderPath));
//     const basename = path.basename(folderPath);

//     return { dirname, basename };
// }

/**
 * { file, type }
 */
export const getRequestFile: RequestHandler = async (req, res, next) => {
    const newFile = <UploadedFile>req.files?.newFile;

    if (!newFile) {
        return res.status(400)
            .json(httpErrors("'newFile' is required in the body"));
    } 

    if (Array.isArray(newFile)) {
        return res.status(400)
            .json(httpErrors("'newFile' should be one file"));
    }

    res.locals.file = newFile;
    res.locals.type = mime.extension(newFile.mimetype);

    next();
};

/**
 * { file }
 */
export const getFile: RequestHandler = async (req, res, next) => {
    const { fileId: id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json(httpErrors(`Id: '${id}' is not valid`));
    }

    const file = await db.File.findById(id).populate("parentFolder");

    if (!file) {
        return res.status(404)
            .json(httpErrors(`File with Id: '${id}' is not found`));
    }

    res.locals.file = file;
    next();
};

/**
 *  { folder, path } where path is: folderPath + folderName
 */
// export const getFolder: RequestHandler = async (req, res, next) => {
//     const { folderPath } = req.params;
//     const { dirname, basename } = getPathDetails(folderPath);

//     const folder = await db.Folder.findOne({ path: path.normalize(dirname), name: basename })
//         .populate("subFolders")
//         .populate("subFiles");

//     if (!folder) {
//         return res.status(404)
//             .json(httpErrors(`Folder with path: '${dirname}/${basename}' is not found`));
//     }

//     res.locals.folder = folder;
//     res.locals.path = getStorage(dirname, basename);
//     next();
// }


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

export const checkForStorage: RequestHandler = async (req, res, next) => {
    const { folder, file } = res.locals;
    
    const owner = await db.User.findById(folder.owner)
            .populate({
                path: "currentPlan",
                populate: { path: "plan" }
            }) as any;

    const storageGB = owner.currentPlan.plan.storage * 1_000_000;
    if (file.size + owner.usage > storageGB) {
        return res.status(400)
            .json(httpErrors("You available storage is lower than needed"));
    }

    next();
};

export const checkForFileDuplication: RequestHandler = async (req, res, next) => {
    const { file, path: filePath } = res.locals;

    const existedFile = await db.File.findOne({ name: file.name, path: filePath });

    if (existedFile) {
        return res.status(400)
            .json(httpErrors(`Duplicated file name: '${file.name}'`));
    }

    next();
}