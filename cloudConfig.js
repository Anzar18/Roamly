const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'roamly_DEV', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
  }
});

module.exports = {
   cloudinary,
   storage,
};