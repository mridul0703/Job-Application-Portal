# 🧑‍💼 Job Application Portal – Backend
<br/>
<div align="center">

  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/dotenv-8BC34A?style=for-the-badge" /><br/>
  <!-- GitHub Stats Badges -->
  <img src="https://img.shields.io/github/repo-size/mridul0703/job-application-portal-backend?style=for-the-badge" />
  <img src="https://img.shields.io/github/last-commit/mridul0703/job-application-portal-backend?style=for-the-badge" />
  <img src="https://img.shields.io/github/issues/mridul0703/job-application-portal-backend?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" /><br/>
</div>



<br/>
A robust Node.js + Express backend for managing job applications, user roles, and job postings. This backend powers a full-stack job portal system with secure authentication, role-based access control, and RESTful API design.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 👥 Role-based Access Control (Admin, Employer, Applicant)
- 📄 Job Posting, Application, and Management APIs
- 📟 Resume Upload Support (via Multer or similar middleware)
- 📁 Modular MVC Architecture
- ✅ Request Validation and Error Handling Middleware
- 🌍 MongoDB Integration with Mongoose ODM

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **dotenv** for environment configuration
- **Multer** (if used) for file uploads

---

## 📁 Folder Structure

```
job-application-portal-backend/
|
├── config/           # DB connection and config setup
├── controllers/      # Business logic and request handling
├── middlewares/      # Auth, error handling, validation
├── models/           # Mongoose schemas
├── routes/           # API route definitions
│
├── .env              # Environment variables
├── .gitignore
├── package.json
├── server.js         # Entry point of the application
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mridul0703/Job-Application-Portal-Backend.git
cd job-application-portal-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root with the following:
```env
MONGO=your_mongo_url
ACCESS_TOKEN_SECRET=your_refresh_token
REFRESH_TOKEN_SECRET=your_refresh_token

```

### 4. Run the Server
```bash
npm start
```

The backend will run at: `http://localhost:5000`

---

## 📡 API Overview

Basic route structure:
```
/api/auth         → User registration & login
/api/jobs         → CRUD operations for jobs
/api/applications → Submit/view applications
```

---

## 🧑‍💻 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📍 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or collaborations: [mridulmkumar07@gmail.com]

