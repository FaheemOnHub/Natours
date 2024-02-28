//be our starting file whereever thing starts...
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //used to re-cognise config file
// console.log(process.env);
dotenv.config({ path: './config.env' });
const TourModel = require('./../models/tourModel');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true, //deprecation_values
    useCreateIndex: true, //deprecation_values
    useFindAndModify: false, //deprecation_values
  })
  .then(() => {
    console.log('DB connection successful at import-script');
  });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`, `utf-8`)
);

const importData = async () => {
  try {
    await TourModel.create(tours);
    console.log('Data transferred successfully');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteAll = async () => {
  try {
    await TourModel.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] == '--import') {
  importData();
} else {
  deleteAll();
}
console.log(process.argv);
