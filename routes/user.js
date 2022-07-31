const User = require('../models/user');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

const router = require('express').Router();

 // UPDATE METHOD

router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString();
}
try{
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set : req.body
    },{new:true});
    res.status(200).send(updatedUser);
}catch(err){
    res.status(500).send(err);
}

})

//DELETE METHOD

router.delete("/:id", verifyTokenAndAuthorization, async(req,res)=>{
try{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("Kullanıcı Silindi.")

}catch(err){
    res.status(500).json(err);
}
})
//Sorgulanan Kullanıcıyı Getir.
router.get("/find/:id", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const  {pssword , ...others} = user._doc;
        res.status(200).json(others);
    
    }catch(err){
        res.status(500).json(err);
    }
    })

// Tüm Kullanıcıları Getir.
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    const query = req.query.new
        try{
            const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
            res.status(200).json(users);
        
        }catch(err){
            res.status(500).json(err);
        }
})

// Kullanıcı İstatistikleri
router.get("/stats",verifyTokenAndAdmin, async(req,res)=>{
const date = new Date();
const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));
try{
    const data = await User.aggregate([
        {$match:{createdAt:{$gte : lastYear}}},
        {$project:{
            month : {$month : "$createdAt"}
        }},
        {$group : {_id : "$month",
        total : {$sum : 1}
        }}, 
    ]);
    res.status(200).json(data);
}catch(err){
    res.status(500).json(err);
}
})







module.exports = router;