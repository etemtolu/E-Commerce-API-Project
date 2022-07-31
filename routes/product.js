const Product = require('../models/product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

const router = require('express').Router();

//CREATE METHOD

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

 // UPDATE METHOD

router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
try{
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
        $set : req.body
    },{new:true});
    res.status(200).send(updatedProduct);
}catch(err){
    res.status(500).send(err);
}

})

//DELETE METHOD

router.delete("/:id", verifyTokenAndAdmin, async(req,res)=>{
try{
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json("Ürün Silindi.")

}catch(err){
    res.status(500).json(err);
}
})
//Get Product.
router.get("/product/:id", async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
    })

// Tüm Kullanıcıları Getir.
router.get("/", async(req,res)=>{
    const nQuery = req.query.new;
    const cQuery = req.query.category
        try{
            let products;
            if(nQuery){
                products = await Product.find().sort({createdAt : -1}).limit(5)
            }else if(cQuery) {
                products = await Product.find({categories : {
                    $in:[cQuery],
                }})
            }else{
                products = await Product.find();
            }


            res.status(200).json(products);
        }catch(err){
            res.status(500).json(err);
        }
})

module.exports = router;