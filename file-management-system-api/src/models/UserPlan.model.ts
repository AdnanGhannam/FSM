import { Types, model, Schema } from "mongoose";
import { USER } from "./User.model";
import { PLAN } from "./Plan.model";

export const USER_PLAN = "UserPlan";

const create = () => {
    const userPlanSchema = new Schema({
        user: {
            type: Types.ObjectId,
            ref: USER
        },
        plan: {
            type: Types.ObjectId,
            ref: PLAN
        },
        startedAt: {
            type: Number,
            immutable: true,
            default: Date.now()
        }
    });

    const UserPlan = model(USER_PLAN, userPlanSchema);

    return UserPlan;
};

const userPlanModel = { create };

export default userPlanModel