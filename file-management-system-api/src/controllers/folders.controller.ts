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
        folder
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
    
};

const downloadEndpoint: RequestHandler = (req, res) => {
    const { file } = res.locals;
    const fullFilePath = path.join(path.dirname(require.main!.filename), file.path, file.name);
    res.status(200).download(fullFilePath);
};

const foldersController = {
    getEndpoint,
    createFolderEndpoint,
    uploadFileEndpoint,
    moveFileEndpoint,
    removeFileEndpoint,
    downloadEndpoint
};

export default foldersController;