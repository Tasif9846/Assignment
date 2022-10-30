const { Schema, model } = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 100,
    },
    email: {
        type: String,
        require: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minLength: 5,
        maxLength: 1025,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  //enum use kore option select kora jai
        default: 'user',
    }
}, { timestamps: true }) //timeStamps diye automaticly new update and user asle date ta set hye jai new kore set kora lagena

userSchema.methods.generateJWT = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role,
            name: this.name,
        }, process.env.JWT_SECRET_KEY, { expiresIn: 600 });
    return token;
}
const validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(4).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    })
    return schema.validate(user);
}
module.exports.User = model('User', userSchema);
module.exports.validate = validateUser;