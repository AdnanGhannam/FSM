import { RequestHandler } from "express";
import { httpErrors, httpResponse, isExisted, isValidId, requiredFields, tryHandle } from "./helpers";
import db from "../models/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types, connection } from "mongoose";

const loginEndpoint: RequestHandler = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400)
            .json(requiredFields({ name, password }));
    }

    const user = await db.User.findOne({ name });
    
    if (!user) {
        return res.status(404)
            .json(httpErrors(`There is no user with name: '${name}'`));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400)
            .json(httpErrors(`Password is wrong`));
    }

    const { SECRET } = process.env;
    const token = jwt.sign({ id: user.id }, SECRET!, { expiresIn: "3h"});

    res.status(200).json(httpResponse(true, { token }));
};

const registerEndpoint: RequestHandler = async (req, res) => {
    const { name, email, password, planId } = req.body;

    if (!name || !email || !password || !planId) {
        return res.status(400)
            .json(requiredFields({ name, email, password, planId }));
    }

    if (!isValidId(planId, res)) return;

    const plan = await db.Plan.findById(planId);

    if (!isExisted(planId, plan, res)) return;

    const hashPassword = await bcrypt.hash(password, 8);

    tryHandle(async () => {
        const session = await connection.startSession();

        let user;
        const currentPlanId = new Types.ObjectId();

        await session.withTransaction(async () => {
            user = await db.User.create({ 
                name, 
                email, 
                password: hashPassword, 
                currentPlan: currentPlanId
            });
            await db.UserPlan.create({ user: user.id, plan: plan?.id });
        });
        
        session.endSession();

        res.status(201).json(httpResponse(true, user));
    }, res);
};

const usersController = {
    loginEndpoint,
    registerEndpoint
};

export default usersController;