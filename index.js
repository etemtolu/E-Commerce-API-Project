const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Veritabanı Bağlantısı Başarılı")
})
.catch(err=>{
    console.log(`Bağlantı Başarısız :  ${err.message}`);
});

const app = express();
app.use(express.json());
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/carts',cartRoute);
app.use('/api/orders',orderRoute);


app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server ${process.env.PORT} Portu İle Çalışıyor`);
});