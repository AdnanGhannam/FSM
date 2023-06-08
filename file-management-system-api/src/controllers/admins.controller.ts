import { RequestHandler } from "express";
import { httpErrors, httpResponse, isExisted, requiredFields } from "./helpers";
import db from "../models/models";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const loginEndpoint: RequestHandler = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400)
            .json(requiredFields({ name, password }));
    }

    const admin = await db.Admin.findOne({ name });
    
    if (!admin) {
        return res.status(404)
            .json(httpErrors(`There is no admin with name: '${name}'`));
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
        return res.status(400)
            .json(httpErrors(`Password is wrong`));
    }

    const { SECRET } = process.env;
    const token = jwt.sign({ id: admin.id }, SECRET!, { expiresIn: "3h"});

    res.status(200).json(httpResponse(true, { token }));
};

const adminsController = {
    loginEndpoint
};

export default adminsController;