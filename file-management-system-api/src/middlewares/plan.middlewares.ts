import { RequestHandler } from "express";
import { Types } from "mongoose";
import { httpErrors } from "../controllers/helpers";
import db from "../models/models";

export const getPlan: RequestHandler = async (req, res, next) => {
    const { planId: id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json(httpErrors(`Id: ${id} is not valid`));
    }

    const plan = await db.Plan.findById(id);

    if (!plan) {
        return res.status(404)
            .json(httpErrors(`Plan with Id: ${id} is not found`));
    }

    res.locals.plan = plan;
    next();
};

export const checkForPayment: RequestHandler = (req, res, next) => {
    // TODO
    next();
};