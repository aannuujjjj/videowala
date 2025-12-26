# Full Stack Authentication System

This repository contains a complete authentication system built with a modern full-stack approach.  
It includes secure authentication, Google OAuth, OTP-based password reset, and a responsive UI.

---

## Features

- User Signup & Login
- Google OAuth Authentication
- JWT-based Authorization
- OTP-based Password Reset
- Secure Email Notifications
- Responsive UI (Desktop & Mobile)
- Material UI based design
- Strong password validation

---

## Tech Stack

### Frontend
- React.js
- Material UI
- React Router
- Axios
- Google OAuth

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Nodemailer

---

## Project Structure

root  
├── backend  
│   ├── middleware  
│   ├── models  
│   ├── routes  
│   ├── utils  
│   └── server.js  
│  
├── frontend  
│   ├── src  
│   ├── public  
│   └── package.json  
│  
├── .gitignore  
└── README.md  

---

## Environment Variables

### Backend (.env)

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN=1d  

EMAIL_USER=your_email  
EMAIL_PASS=your_email_app_password  

GOOGLE_CLIENT_ID=your_google_client_id  

FRONTEND_URL=http://localhost:3000  

---

## How to Run

### Backend
cd backend  
npm install  
npm run dev  

### Frontend
cd frontend  
npm install  
npm start  

---

## Security Notes

- `.env` files are ignored
- No secrets are committed
- Credentials must be provided by the organization

---

## License

Internal / Proprietary – usage as per company policy
