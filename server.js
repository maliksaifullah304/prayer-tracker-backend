require('dotenv').config();
const mongoose = require('mongoose');
let cookieParser = require('cookie-parser');

const app = require('./src/app');
app.use(cookieParser());
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('DB Connection Successful!');
  })
  .catch((error) => {
    console.log(error, 'err');
  });

const Port = process.env.PORT || 4000;
app.listen(Port, console.log(`Server is running ${Port}`));
