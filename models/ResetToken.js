import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";


const resetTokenSchema = new Schema(
    {
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token:{
        type: String,
        required:true,
    },
    createdAt:{
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

resetTokenSchema.pre("save", async function (next){
    if(this.isModified("token")){
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next()
})

resetTokenSchema.methods.compareToken = async function (token){
    const result = await bcrypt.compareSync(token, this.token);
    return result;
}

const ResetToken = model("resetToken", resetTokenSchema);

export default ResetToken;