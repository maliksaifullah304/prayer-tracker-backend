const multer = require("multer");
const path = require("path");
const AppError = require("./appError");

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, path.join(__dirname, "../uploads/")); // Specify the destination folder where uploaded files will be stored
  //   },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const filename = `${timestamp}${fileExtension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, next) => {
  if (file.mimetype.startsWith("image/")) {
    next(null, true);
  } else {
    return next(new AppError("only images allowed ", 404));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload;
