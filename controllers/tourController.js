const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log('Passed here');
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  next();
};
exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newid = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newid }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.json({
        tour: newTour,
      });
    }
  );
  //   res.send('Done'); //wee always need to send back something just to complete the req-res cycle
};

exports.getTourbyId = (req, res) => {
  const id = req.params.uid * 1;
  const ans = tours.find((el) => el.id === id);

  res.json({
    status: 'success',
    data: {
      tours: ans,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Updated Data will be here...',
    },
  });
};

exports.getAllTours = (req, res) => {
  res.json({
    status: 'success',
    requestedAT: req.TimeOfRequest,
    data: {
      tours,
    },
  });
};

//delete--request
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
