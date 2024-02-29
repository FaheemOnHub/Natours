const express = require('express');
const TourModel = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.sort = '-ratingsAverage,price';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const hardQueryObject = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete hardQueryObject[el]);

    let queryString = JSON.stringify(hardQueryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matchedWord) => `$${matchedWord}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBY = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBY);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldQuery = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldQuery);
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skipNumber = (page - 1) * limit;
    this.query = this.query.skip(skipNumber).limit(limit);
    return this;
  }
}

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

  //Sorting using mongoose

  //Field Limiting

  //Pagination...
  //if page=3, limit=10, then the result shown will be=>from 21-30, as 1-10,11-20, will be skipped

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
