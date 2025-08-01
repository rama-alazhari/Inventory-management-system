const mongoose = require ('mongoose')
const validator = require ('validator')
 const bcryptjs = require ('bcryptjs')
 const jwt = require ('jsonwebtoken')

const userSchema = new mongoose.Schema ( {
    username: {
        type: String,
        required: [true, "Provide User Name"],
        trim: true,
        lowercase : true,
        unique: true
    },
    password : {
        type: String,
        required: [true, "provide password"],
        trim: true,
        minlength: 3,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[0-9])");
            if(!password.test(value)){
                throw new Error("Password must include  lowercase , numbers ")
            }
        }
    },
    email : {
        type: String,
        trim: true,
        lowercase : true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error ('Email is INVALID')
            }
        }
    },
    tokens : [
        {
            type: String,
            required : true
        }
    ],
    lastLogin: {
        type: Date,
        default: Date.now,
    },
   
 }
);
////////////////////hash password/////////////////////////////
userSchema.pre("save",async function (next) {
    try {
        let user = this 
        if ( !user.isModified('password')){
            return next()
        }
        let hashedPass = await bcryptjs.hash(user.password , 8)
        user.password = hashedPass
        next()
    }
    catch (error){
        next(error)}
    })
///////////////////////////// Login ///////////////////////////////////////////////////////////////
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};
//////////////////////////token////////////////////////////////////////////////////////////////
userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // بدلاً من تخزين كائن، خزّن النص مباشرةً داخل المصفوفة
    user.tokens = user.tokens.concat(token);
    
    await user.save();
    return token;
};

////////////////////////  hide private data ////////////////////////////////////////////////////////////////////
  userSchema.methods.toJSON = function (){
      const user = this 
      const userObject = user.toObject()

      delete userObject.password
      delete userObject.tokens
      return userObject 
  }
  //////////////////////////////////////////////////////////////////////
const User = mongoose.model( 'User' , userSchema  )


module.exports = User