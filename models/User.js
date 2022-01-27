const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  // creating the salt: a string that will be preattached to the password
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  // searching for the user that's trying to login
  const user = await this.findOne({ email });
  if (user) {
    // comparing the password entered in the frontend with the password stored in the database
    const auth = bcrypt.compare(password, user.password)
    if (auth) {
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;