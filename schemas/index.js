const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect('mongodb+srv://smy1308:gYMKAjFfuXb1dowF@cluster0.fgwbkpo.mongodb.net//spa_mall')
    .then(() => console.log("MongoDB Cennected"))
    .catch(err => console.log(err));
};

mongoose.connection.on('error', err => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;