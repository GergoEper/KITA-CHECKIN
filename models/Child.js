const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const childSchema = new Schema({

    firstname: String,
    lastname:  String,
    birthdate: Date,
    parent: [{
        type: Schema.Types.ObjectId,
        ref: 'User.model'
      }],
    contactData: {
        address: {
            street: String, 
            houseNumber: String,
            city: String,
            zipCode: Number
        },
        phoneNumber: String
    },
    status: {
        type: String,
        enum: ['in', 'out'],
        default: 'out', 
    },    
    alias: String,
});

const Child = model("Child", childSchema);

module.exports = Child;