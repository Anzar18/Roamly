# Roamly - Travel Listings Platform

Roamly is a full-stack web application built with Node.js and Express that allows users to browse, create, and manage travel listings. The platform includes features for user authentication, listing management, and review systems.

## 🚀 Features

- User Authentication and Authorization
- Create, Read, Update, and Delete (CRUD) operations for travel listings
- Review system for listings
- Image upload functionality using Cloudinary
- Interactive maps integration with Mapbox
- Responsive design using EJS templates
- Session management with MongoDB
- Flash messages for user feedback

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Frontend**: EJS (Embedded JavaScript) templates
- **File Upload**: Multer with Cloudinary integration
- **Maps**: Mapbox SDK
- **Session Management**: Express-session with MongoDB store
- **Form Validation**: Joi
- **Styling**: Custom CSS

## 📋 Prerequisites

- Node.js (v22.14.0 or higher)
- MongoDB Atlas account
- Cloudinary account
- Mapbox account

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Anzar18/Roamly
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
ATLAS_URL=your_mongodb_atlas_url
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_token
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
phase1/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # Express routes
├── views/          # EJS templates
├── public/         # Static files
├── utils/          # Utility functions
├── middleware.js   # Custom middleware
├── app.js          # Main application file
└── package.json    # Project dependencies
```

## 🔐 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `ATLAS_URL`: MongoDB Atlas connection string
- `SECRET`: Session secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `MAPBOX_TOKEN`: Mapbox access token


## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database
- Cloudinary for image hosting
- Mapbox for mapping services 
