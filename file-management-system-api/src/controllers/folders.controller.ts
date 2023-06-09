import { RequestHandler } from "express";
import db from "../models/models";
import { httpErrors, httpResponse, isExisted, tryHandle } from "./helpers";
import path from "path";
import { Types, connection, startSession } from "mongoose";
import fs from "fs";
import { Visibilities } from "../models/Folder.model";

// TODO Check if visible
const getEndpoint: RequestHandler = async (req, res) => {
    const { folder } = res.locals;

    res.status(200).json(httpResponse(true, folder));
};

const createFolderEndpoint: RequestHandler = async (req, res) => {
    const { name, visibility, visibleTo } = req.body;
    const { folder, path: newfolderPath } = res.locals;

    if (visibility && !Visibilities.includes(visibility)) {
        return res.status(400)
            .json(httpErrors("The 'visibility' field should be: 'public' or 'private' or 'custom'"));
    }

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            const newfolderId = new Types.ObjectId();
            await db.Folder.create({
                _id: newfolderId,
                owner: folder.owner,
                name,
                parentFolder: folder.id,
                path: newfolderPath,
                visibility: visibility || Visibilities[0],
                visibleTo: visibleTo || []
            });

            await folder.updateOne({ subFolders: [...folder.subFolders, newfolderId] });
        });

        const fullPath = path.join(path.dirname(require.main!.filename), newfolderPath, name);
        if (!fs.existsSync(fullPath)){
            fs.mkdirSync(fullPath);
        }

        await session.endSession();

        res.status(201).json();
    }, res);
};

const uploadFileEndpoint: RequestHandler = async (req, res) => {
    const { 
        path: storage, 
        file: requestFile, 
        type, 
        folder,
        user
    } = res.locals;

    tryHandle(async () => {
        const session = await connection.startSession();

        let file;
        await session.withTransaction(async () => {
            // add to files
            file = await db.File.create({ 
                name: requestFile.name, 
                type, 
                path: storage, 
                parentFolder: folder.id 
            });

            await folder.updateOne({ subFiles: [...folder.subFiles, file.id] });

            await user.updateOne({ usage: requestFile.size });
        });

        // move it to storage
        await requestFile.mv(path.join(path.dirname(require.main!.filename), storage, requestFile.name));

        await session.endSession();

        res.json(httpResponse(true, file));
    }, res);
};


const moveFileEndpoint: RequestHandler = (req, res) => {
    const { file, folder, path: folderPath } = res.locals;

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            await db.Folder.findByIdAndUpdate(
                file.parentFolder,
                { $pull: { subFiles: file.id }});

            await file.updateOne({ 
                parentFolder: folder.id, 
                path: path.join(folder.path, folder.name) 
            });

            await folder.updateOne({ subFiles: [...folder.subFiles, file.id] });
        });

        const rootPath = path.dirname(require.main!.filename);
        const oldFullPath = path.join(rootPath, file.path, file.name);
        const newFullPath = path.join(rootPath, folder.path, folder.name, file.name);
        
        fs.rename(oldFullPath, newFullPath, err => {
            // TODO throw an error
            if (err) throw err;
        });

        await session.endSession();

        res.status(204).json();
    }, res);
};

const removeFileEndpoint: RequestHandler = (req, res) => {
    const { folder, file, user } = res.locals;

    const fullFilePath = path.join(path.dirname(require.main!.filename), file.path, file.name);
    const fileSize = fs.statSync(fullFilePath).size;

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            await file.deleteOne();

            await folder.updateOne({ $pull: { subFiles: file.id } });

            await user.updateOne({ usage: user.usage - fileSize });

            fs.rm(fullFilePath, console.error);
        });

        await session.endSession();

        res.status(204).json();
    }, res)
};

const downloadEndpoint: RequestHandler = (req, res) => {
    const { file } = res.locals;
    const fullFilePath = path.join(path.dirname(require.main!.filename), file.path, file.name);
    res.status(200).download(fullFilePath);
};

// FIXME check for allowed number of memebers depending on the current plan
const updateFolderPermissionsEndpoint: RequestHandler = (req, res) => {
    const { folder, user } = res.locals;
    const { permissions } = req.body;

    if (folder.owner != user.id) {
        return res.status(401)
            .json(httpErrors("You don't have privilege to do this action"));
    }

    if (!Array.isArray(permissions)) {
        return res.status(400)
            .json(httpErrors("wrong request format"));
    }

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            const folderPermissions: any = [];
            for (let p of permissions) {
                if (!p.user || !p.permission) continue;

                if (!Types.ObjectId.isValid(p.user)) continue;

                if (!await db.FolderPermission.findOne({ folder: folder.id, user: p.user })) {
                    const newPermission = await db.FolderPermission.create({
                        user: p.user,
                        folder: folder.id,
                        permissions: p.permission
                    });

                    if (newPermission) folderPermissions.push(newPermission.id);
                }
            }

            await folder.updateOne({ usersPermissions: folderPermissions });
        });

        await session.endSession();
    }, res);
    res.status(204).json();
};

const removeFolderEndpoint: RequestHandler = async (req, res) => {
    const { folder } = res.locals;

    if (folder.subFiles.length != 0 || folder.subFolders.length != 0) {
        return res.status(400)
            .json(httpErrors("This Folder can't be deleted, because it has a sub-folders or sub-files"));
    }

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            const parent = folder.parentFolder;

            if (parent) {
                await parent.updateOne({ $pull: { subFolders: folder.id }});
            }

            await folder.deleteOne();

            const fullPath = path.join(path.dirname(require.main!.filename), folder.path, folder.name);
            fs.rmdirSync(fullPath);
        });

        await session.endSession();

        res.status(204).json();
    }, res);
};

const foldersController = {
    getEndpoint,
    createFolderEndpoint,
    uploadFileEndpoint,
    moveFileEndpoint,
    removeFileEndpoint,
    downloadEndpoint,
    updateFolderPermissionsEndpoint,
    removeFolderEndpoint
};

export default foldersController;