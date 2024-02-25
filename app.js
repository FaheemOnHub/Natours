const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRoutes = require('./Routes/tourRoutes');
const userRoute = require('./Routes/userRoutes');

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //this express.json is middleware as it stands b/w request and response //data from the body is added to the req
// app.get('/', (req, res) => {
//   //   res.send('Hello from the server side');
//   res.json({ message: 'Hey its,Me' });
// });

app.use(express.static(`${__dirname}/public`)); //access to static files
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  console.log('I am working');
  req.TimeOfRequest = new Date().toISOString();
  next();
});

// app.post('/api/v1/tours', createTour); //route-1
// app.get('/api/v1/tours/:id', getTourbyId); //route-2
// app.patch('/api/v1/tours/:id', updateTour); //route-3
// app.get('/api/v1/tours', getAllTours); //route-4
// app.delete('/api/v1/tours/:id', deleteTour); //route-5

//Routes

app.use('/api/v1/users', userRoute);
//creating a new route
app.use('/api/v1/tours', tourRoutes);

module.exports = app;
