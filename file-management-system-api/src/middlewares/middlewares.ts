import express, { Express } from "express"
import fileUpload from "express-fileupload";
import cors from "cors";

const config = (app: Express) => {
    app.use(fileUpload({ createParentPath: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
};

const middlewares = { config };

export default middlewares;
