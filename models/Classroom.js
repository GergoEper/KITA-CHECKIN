const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
    name: String,
    child: [{
        type: Schema.Types.ObjectId,
        ref: 'Child',
        role: {
            type: String,
            enum: ['child']
        }
    }],
    // parent: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Parent',
    //     role: {
    //         type: String,
    //         enum: ['parent']
    //     },
    // }],
    teacher: [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        role: {
            type: String,
            enum: ['teacher']
        }
    }]
});

const Parent = model("Parent", userSchema);

module.exports = Parent;