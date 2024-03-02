const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();
router.route('/tour-count/:year').get(tourController.getMonthlyPlan);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-status').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:uid')
  .get(tourController.getTourbyId)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
