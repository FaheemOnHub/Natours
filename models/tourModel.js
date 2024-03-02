const mongoose = require('mongoose');

//Mongoose-Schema...
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: [40, 'Name should be less than 40 char'],
      minlength: [10, 'Name should be greater than 10 char'],
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
      enum: ['easy', 'medium', 'difficult'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than 0'],
      max: [5, 'Rating should not be greater than 5'],
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
    secretTour: {
      type: String,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  //virtual prop cannot be used in query, as they are not part of a schema,e.g api/tours?durationWeeks[gte]=5;❌
  return this.duration / 7;
});
tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre('aggregate', function () {
  //as the pipeline is an array, so we can just add another aggregator in the inital,
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()); //points to curr aggregration object
});

//pre-save runs before save and create command only
// tourSchema.pre('save', function (next) {
//   console.log(this); //here this refers to the curr processed doc
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Mongoose-Model
const TourModel = mongoose.model('Tour', tourSchema);

module.exports = TourModel;
