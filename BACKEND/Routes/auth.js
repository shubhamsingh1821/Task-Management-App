const express = require('express') ; 
const router = express.Router() ; 
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECTRET = "shubhamisagoodbpy@1" ; 

//Route -1 : create a User  using POST /api/auth/createuser . No logn required 
router.post( '/createuser' , [
    body('email' , "Enter a valid email").isEmail(),
    body('password' , "Enter a valid password").isLength({ min: 5 }),
    body('name' , "Enter a valid name").isLength({ min: 3 })

] ,async (req , res) => {
    let success = false

    const errors = validationResult(req);
    //if there are errors return bad request and the errors 
    if (!errors.isEmpty()) {
      return res.status(400).json({success , errors: errors.array() });
    }

    try{
        let user = await User.findOne({success ,  email : req.body.email})
    if(user) { 
        res.json({success , error : "A user with this email already exists "})
    }

    // password hashing 
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password , salt)

    // create a new user 
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })

    //token generation 
      const data = {
        user : {
            id : user.id
        }
      }

      const authToken = jwt.sign(data , JWT_SECTRET)

      console.log(authToken);
      success = true
    res.json({success , authToken})


    console.log(req.body);
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})


//Route -2 : Authenticate a user to login  : POST /API/AUTH/LOGIN . No login required

router.post( '/login' , [

    body('email' , "Enter a valid email").isEmail(),
    body('password' , "Password cannot be blank").isLength({ min: 5 }),

] ,async (req , res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Validating email and passwrd and sending the token 
    const {email , password} = req.body
    try{

        const user = await User.findOne({email})
        if(!user){
            success=false
            return res.status(400).json({error : "Please try to loigin with correct cridentials"})
        }
 
        const passwordCompare = await bcrypt.compare(password , user.password)
        if(!passwordCompare){
            success = false
            return res.status(400).json({success , error : "Please try to loigin with correct cridentials1"})
        }

        const data = {
            user : {
                id : user.id
            }
          }
    
          const authToken = jwt.sign(data , JWT_SECTRET)
          success = true
          res.json({success , authToken})

    }catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

//Route-3 : Get loggen in user details using POST "/api/auth/getuser" . Login required 
router.post( '/getuser', fetchuser ,async (req , res) => {
    try{

        userId = req.user.id  

        const user = await User.findById(userId).select("-password")
        res.send(user)

    }catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

module.exports = router

