const router = require('express').Router();
const User = require('../models/user')
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')

router.post('/register',async (req,res)=>{
    const newUser = new User({
        username : req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString()
    })
   try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
   }
   catch(err){
    res.status(500).json(err);
   }
});

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({username : req.body.username});
        !user && res.status(401).json("Giriş Başarısız.");

        const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.PASS_SECRET);
       
        const password = hashedPassword.toString(CryptoJS.enc.Utf8);
        password !== req.body.password && res.status(401).json("Giriş Başarısız.");
        const  {pssword , ...others} = user._doc;
        const accessToken = jwt.sign({
            id : user._id, isAdmin : user.isAdmin
        },process.env.JWT_SEC,{expiresIn:'1d'});
        res.status(200).json({...others,accessToken});
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;