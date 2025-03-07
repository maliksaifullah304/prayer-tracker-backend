const AppError = require("../utils/appError");

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidateErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicateErr = (err) => {
  const field = Object.keys(err.keyValue)[0];

  const message = `Duplicate Field Value: ${field}. Please use another value`;
  return new AppError(message, 400);
};

const sendDevErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdErr = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || "",
    });
  } else {
    console.error("ERROR 🎇", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevErr(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);

    if (error.name === "CastError") {
      error = handleCastErrDB(error);
    }

    if (error.name === "ValidationError") {
      error = handleValidateErr(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateErr(error);
    }

    sendProdErr(error, res);
  }
};
