const express = require('express');
const TourModel = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.createTour = async (req, res) => {
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

  try {
    const features = new APIFeatures(TourModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const allTours = await features.query;
    {
      res.status(200).json({
        status: 'Success',
        data: {
          tour: allTours,
        },
      });
    }
  } catch (error) {
    res.json({
      status: 'fail',
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await TourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$ratingsAverage',
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);
    res.status(200).json({
      status: 'PASS',
      data: stats,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
  ]);
  res.status(200).json({
    status: 'PASS',
    data: plan,
  });
};
