import { RequestHandler } from "express";
import { httpResponse, requiredFields, tryHandle } from "./helpers";
import db from "../models/models";

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

const plansController = {
    createEndpoint
};

export default plansController;