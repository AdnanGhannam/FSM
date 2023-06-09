import { Types, Schema, model } from "mongoose";

export const PLAN = "Plan";

const create = () => {
    const planSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        cost: {
            type: Number,
            required: true,
            default: 0
        },
        storage: {
            type: Number,
            required: true
        },
        numberOfMemebers: {
            type: Number,
            required: true,
            default: 1
        },
        level: {
            type: Number,
            required: true,
        }
    });

    const Plan = model(PLAN, planSchema);

    return Plan;
}

const planModel = { create };

export default planModel;