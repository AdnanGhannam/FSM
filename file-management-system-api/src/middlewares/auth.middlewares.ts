import { RequestHandler } from "express";
import { httpErrors, httpResponse } from "../controllers/helpers";
import jwt from "jsonwebtoken";
import db from "../models/models";

/**
 * Call this middleware before any authorization middleware
 */
const authenticate: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(403)
            .json(httpErrors("JWT token is required!"));
    }

    const { SECRET } = process.env;

    if (!SECRET) {
        console.error("APP ERROR:", "Failed to get 'SECRET' from dotenv file!");
        return res.status(500)
            .json(httpErrors("Something went wrong, please try again later"));
    }

    jwt.verify(token, SECRET, async (err, doc: any) => {
        if (err) {
            return res.status(400)
                .json(httpErrors("JWT token is not valid"));
        }

        const id = doc?.["id"]
        const user = await db.User.findById(id);
        const admin = await db.Admin.findById(id);

        if (!user && !admin) {
            return res.status(404)
                .json(httpErrors(`User with Id: ${id} is not found`));
        }


        res.locals.user = user;
        res.locals.admin = admin;

        next();
    });
};

const authorize: RequestHandler = (req, res, next) => {
    // TODO
    next();
};

const authorizeAdmin: RequestHandler = async (req, res, next) => {
    const { admin } = res.locals;

    if (!admin) {
        return res.status(401)
            .json(httpErrors(`You can't preform this action`));
    }

    next();
};

const auth = {
    authenticate,
    authorizeAdmin
};

export default auth;