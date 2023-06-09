import { RequestHandler } from "express";
import { httpErrors, httpResponse, requiredFields, tryHandle } from "./helpers";
import db from "../models/models";
import { connection } from "mongoose";

const createEndpoint: RequestHandler = async (req, res) => {
    const { name, duration, storage, cost, numberOfMemebers } = req.body;

    if (!name || !duration || !storage) {
        return res.status(400)
            .json(requiredFields({ name, duration, storage }));
    }

    tryHandle(async () => {
        const plan = await db.Plan.create({ name, duration, storage, cost, numberOfMemebers });

        res.status(201)
            .json(httpResponse(true, plan));
    }, res);
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const plans = await db.Plan.find();

    res.status(200).json(httpResponse(true, plans));
};

const upgradeToEndpoint: RequestHandler = async (req, res) => {
    const { user, plan } = res.locals;

    const currentUserPlan = 
        await db.UserPlan.findOne({ user: user.id, plan: plan.id })
            .populate("plan") as any;

    if (currentUserPlan?.plan.level >= plan.level) {
        return res.status(400)
            .json(httpErrors("The plan's level should bigger than the current plan's level"));
    }

    tryHandle(async () => {
        const session = await connection.startSession();

        await session.withTransaction(async () => {
            await currentUserPlan?.deleteOne();

            const userPlan = await db.UserPlan.create({ user: user.id, plan: plan.id });
            
            await user.updateOne({ currentPlan: userPlan.id });
        });

        await session.endSession();
    }, res);
};

const plansController = {
    createEndpoint,
    getAllEndpoint,
    upgradeToEndpoint
};

export default plansController;