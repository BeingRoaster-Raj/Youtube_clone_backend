import mongoose, {Schema} from "mongoose";

const SubscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,  // one who subscribes
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,  // one who is being subscribed to
        ref: "User"
    }
}, {timestamps: true})




export const SubscriptionModel = mongoose.model("Subscription", SubscriptionSchema)