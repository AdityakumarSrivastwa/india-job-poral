//const express=require('express');
const mongoose = require("mongoose");
//const dotenv=require('dotenv');

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    // console.log("Database is connected");
  } catch (error) {
    // console.log(`mongoDB Error ${error}`);
  }
};
module.exports = connectDB;
