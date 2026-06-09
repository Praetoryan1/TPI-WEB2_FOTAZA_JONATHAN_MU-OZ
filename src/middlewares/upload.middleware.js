const multer = require('multer');
const path = require('path');
const fs = require('fs');

const publicationsUploadDir = path.join(__dirname, '../../public/uploads/publications');

if (!fs.existsSync(publicationsUploadDir)) {
  fs.mkdirSync(publicationsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicationsUploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'), false);
  }

  return cb(null, true);
};

const uploadPublicationImages = multer({
  storage,
  fileFilter,
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = {
  uploadPublicationImages
};