const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase:true
  },
  password: String
});

const ModelClass = mongoose.model('user', UserSchema);

module.exports = ModelClass;
