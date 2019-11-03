const mongoose = require('mongoose');
require('dotenv').config();

const dburl = process.env.MONGO_URI;
mongoose.connect(dburl, {
    useNewUrlParser: true
}).then(() => {
    console.log('Database connected successfully!');
}).catch(err => {
    console.log(err);
});
