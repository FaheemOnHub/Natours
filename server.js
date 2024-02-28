//be our starting file whereever thing starts...
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //used to re-cognise config file
// console.log(process.env);
dotenv.config({ path: './config.env' });
const app = require('./app');

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
    console.log('DB connection successful');
  });

// const testTour = new TourModel({
//   name: 'The Forest Hiker',
//   rating: 4.3,
//   price: 200,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('We have a ERROR', err);
//   });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
