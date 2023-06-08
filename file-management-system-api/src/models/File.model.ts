import { Types, Schema, model } from "mongoose";
import { FOLDER } from "./Folder.model";
import path from "path";

export const FILE = "File";

const findFileType = (name: string) => {
    const extension = path.extname(name);

    const document = ["doc", "docx", "pdf", "txt", "rtf", "odt", "html", "htm", "md"];

    if (document.includes(extension)) {
        return "doc";
    }

    const image = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "ico", "webp"];

    if (image.includes(extension)) {
        return "img";
    }

    const video = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];

    if (video.includes(extension)) {
        return "vid";
    }

    return "other";
}

const create = () => {
    const fileSchema = new Schema({
        name: {
            type: String,
            match: /^[\w,\s-]+\.[A-Za-z]{1,3}$/,
            required: true
        },
        parentFolder: {
            type: Types.ObjectId,
            ref: FOLDER,
            required: true
        },
        path: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true
        }
    });

    fileSchema.pre("save", function(next) {
        this.type = findFileType(this.name);
        next();
    });

    const File = model(FILE, fileSchema);
    
    return File;
}

const fileModel = { create };

export default fileModel;