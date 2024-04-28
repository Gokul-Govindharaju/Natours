const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss =require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

// serving static files
app.use(express.static(path.join(__dirname,'public')));
// MIDDLEWARES
// Set security HTTP headers 
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org','https://js.stripe.com',
'https://m.stripe.network',
'https://*.cloudflare.com',];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
  
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org','https://js.stripe.com','https://*.stripe.com',

'https://*.cloudflare.com/',
'https://bundle.js:*',
'ws://127.0.0.1:*/',];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com',];
 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
      baseUri: ["'self'"],
      connectSrc: ["'self'",
      "'unsafe-inline'",
      'data:',
      'blob:', ...connectSrcUrls],
      scriptSrc: ["'self'",
      'https:',
      'http:',
      'blob:', ...scriptSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'",
      'data:',
      'blob:',
      'https://m.stripe.network',],
      childSrc: ["'self'", 'blob:'],
      formAction: ["'self'"],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      upgradeInsecureRequests: [],
    }
  })
);

// Developing logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests from this IP, please try again in an hour!'
})
app.use('/api',limiter)

// Body parser, reading data from body 
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser())
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss()) ;

// Prevent parameter pollution
app.use(hpp({
  whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));



// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTE HANDLERS

//ROUTES

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id',getTour)

// app.post('/api/v1/tours',createTour)

// app.patch('/api/v1/tours/:id',updataTour)
// app.delete('/api/v1/tours/:id',deleteTour)

// app
// .route('/api/v1/tours')
// .get(getAllTours)
// .post(createTour);

// app
// .route('/api/v1/tours/:id')
// .get(getTour)
// .patch(updataTour)
// .delete(deleteTour);

app.use('/',viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// SERVER

module.exports = app;
