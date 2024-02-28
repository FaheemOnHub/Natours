const mongoose = require('mongoose');

//Mongoose-Schema...
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration should be there'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  discount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have cover Image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

//Mongoose-Model
const TourModel = mongoose.model('Tour', tourSchema);

module.exports = TourModel;

// const tour = new TourModel({
//   name: 'Faheem',
//   rating: 4.3,
//   price: 200,
// });
// tour
//   .save()
//   .then((savedUser) => {
//     console.log('User saved successfully:', savedUser);
//   })
//   .catch((error) => {
//     console.error('Error saving user:', error);
//   });
