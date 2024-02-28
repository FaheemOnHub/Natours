const { json } = require('express');
const TourModel = require('./../models/tourModel');

exports.checkID = (req, res, next, val) => {
  // console.log('Passed here');
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // next();
};
exports.checkBody = (req, res, next) => {
  // if (!req.body.name || !req.body.price) {
  //   return res.status(404).json({
  //     status: 'fail',
  //   });
  // }
  // next();
};
exports.createTour = async (req, res) => {
  //   console.log(req.body);
  // const newid = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newid }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.json({
  //       tour: newTour,
  //     });
  //   }
  // );
  //   res.send('Done'); //wee always need to send back something just to complete the req-res cycle

  try {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.json({
      status: 'Failed',
    });
  }
};

exports.getTourbyId = async (req, res) => {
  // const id = req.params.uid * 1;
  // const ans = tours.find((el) => el.id === id);
  // res.json({
  //   status: 'success',
  //   data: {
  //     tours: ans,
  //   },
  // });
  const id = req.params.uid;
  const idTour = await TourModel.findById(id);
  try {
    res.status(200).json({
      status: 'Success',
      data: {
        tour: idTour,
      },
    });
  } catch (err) {
    res.json({
      status: 'Failed',
    });
  }
};

exports.updateTour = async (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     message: 'Updated Data will be here...',
  //   },
  // });
  try {
    const toured = await TourModel.findByIdAndUpdate(req.params.uid, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Updated ',
        toured,
      },
    });
  } catch (error) {
    res.json({
      status: 'Failed',
      error,
    });
  }
};

exports.getAllTours = async (req, res) => {
  //shallow copy
  let queryObject = req.query;
  console.log(queryObject);
  //Hard copy
  const hardQueryObject = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete hardQueryObject[el]);

  let queryString = JSON.stringify(hardQueryObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (matchedWord) => `$ ${matchedWord}`
  );
  console.log(queryString);
  console.log(JSON.parse(queryString));

  // res.json({
  //   status: 'success',
  //   requestedAT: req.TimeOfRequest,
  //   data: {
  //     tours,
  //   },
  // });
  // console.log(req.query);

  // const allTours = await TourModel.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
  try {
    const allTours = await TourModel.find(JSON.parse(queryString));
    res.status(200).json({
      status: 'Success',
      data: {
        tour: allTours,
      },
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};
//When getAllTours function is invoked,
//the program will wait for the TourModel.find() promise to resolve,
//but in the meantime, other functions or code blocks outside of getAllTours can continue to execute.

//delete--request
exports.deleteTour = async (req, res) => {
  await TourModel.findByIdAndDelete(req.params.uid);
  try {
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    res.json({
      status: 'failed',
      message: error,
    });
  }
};
