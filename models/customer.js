const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const customerSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true
    }
});

customerSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model( 'Customer', customerSchema);