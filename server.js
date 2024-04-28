const mongoose = require('mongoose');
const dotenv = require('dotenv');

// process.on('uncaughtException', (err) => {
  
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name,err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('ERROR',err));

// const testTour = new Tour({
//   name: 'The PARK CAMPER',

//   price: 997
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR 💥', err);
//   });

// console.log(app.get('env'));
// console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});

// process.on('unhandledRejection', (err) => {
  
//   console.log('UNHANDLER REJECTION! 💥 Shutting down...');
//   console.log(err.name),err.message;
//   server.close(() => {
//     process.exit(1);
//   });
// });



