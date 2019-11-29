import mongoose, {Schema} from 'mongoose';

const ActivationCodeSchema = new Schema({
    validationCode: {
        type: String,
        maxlength: 6,
        trim: true,
    },
    validationCodeSendDate: {
        type: Date
    },
    validationCodeExpirationDate: {
        type: Date
    },
});

const ActivationCode = mongoose.model("activationCode", ActivationCodeSchema);

export default ActivationCode;