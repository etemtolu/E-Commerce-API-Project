const Product = require('../models/product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

const router = require('express').Router();

//CREATE METHOD

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

 // UPDATE METHOD

router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
try{
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
        $set : req.body
    },{new:true});
    res.status(200).send(updatedCart);
}catch(err){
    res.status(500).send(err);
}

})

//DELETE METHOD

router.delete("/:id", verifyTokenAndAuthorization, async(req,res)=>{
try{
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json("Ürün Silindi.")

}catch(err){
    res.status(500).json(err);
}
})


//Get Cart.
router.get("/cart/:userId", async(req,res)=>{
    try{
        const carts = await Cart.findOne({userId : req.params.userId});
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
    })

// // Get All Cart.

router.get("/", verifyTokenAndAuthorization,async (req,res)=>{
try{
    const carts = await Cart.find();
    res.status(200).json(carts);
}catch(err){
    res.status(500).json(err);
}
})




module.exports = router;