# PRMS Payroll

## Description
A payroll management system built using React with TypeScript, MongoDB as the database, and Cloudinary for media storage. The project runs using Vite as the build tool and is hosted on an HTTP server.

## Features
- React-based frontend with TypeScript (.tsx files)
- MongoDB database
- Cloudinary for media storage
- Uses Vite for fast development and build
- Single project structure (no separate frontend/backend folders)
- Supports build and run implementations

## Prerequisites
Ensure you have the following installed before running the project:
- Node.js
- MongoDB
- npm or yarn
- Cloudinary account

## Installation

### Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### Install Dependencies
```bash
npm install
```

## Configuration
Create a `.env` file in the project root with the following details:
```
MONGO_URI=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

## Running the Project

### Start MongoDB
Make sure MongoDB is running locally or use a remote MongoDB Atlas database.

### Start the Application
```bash
npm run dev
```

## Build the Project
```bash
npm run build
```

## Deployment

### Hosting on an HTTP Server
1. Build the application using:
   ```bash
   npm run build
   ```
2. Use a simple HTTP server like `serve` to host it locally:
   ```bash
   npm install -g serve
   serve -s dist
   ```
3. Deploy the build output (`dist` folder) to a cloud server or hosting provider.

## Sample Data
Use the following credentials for testing:

### Admin Account
- Email: admin@company.com
- Password: admin@123

### HR Account
- Email: hr@company.com
- Password: hr@123

### Employee Account
- Email: employee@company.com
- Password: empoyee@123

## Technologies Used
- React.js with TypeScript (.tsx files)
- MongoDB
- Cloudinary
- Express.js (Backend framework)
- Node.js
- Vite (Build tool)

## License
This project is licensed under the MIT License.
