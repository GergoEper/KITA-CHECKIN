const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const parentSchema = new Schema({

    firstname: String,
    lastname:  String,
    birthdate: String,
    child: [{
        type: Schema.Types.ObjectId,
        ref: 'Child'
      }],
    contactData: {
        address: {
            street: String, 
            houseNumber: String,
            city: String,
            zipCode: Number
        },
        phoneNumber: {
            
        }
    }
});

const Parent = model("Parent", parentSchema);

module.exports = Parent;