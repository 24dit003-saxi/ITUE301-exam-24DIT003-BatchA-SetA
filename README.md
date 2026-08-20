# MedCare Plus - Hospital Appointment System

MedCare Plus is a private hospital management system built with the MERN stack (React, Express.js, and MongoDB Mongoose). This system maintains information about doctors, patients, and schedules appointment consultations.

This project was built for the Practical Examination - Set A.

---

## 1. Directory Structure

```text
24DIT003_Sakshi_SetA/
├── frontend/             # React (Vite) Application
│   ├── src/              # React Source code
│   └── package.json      # Frontend dependencies
│
├── backend/              # Express Node API Server
│   ├── models/           # Mongoose schemas
│   ├── server.js         # API Server Entrypoint
│   └── package.json      # Backend dependencies
│
├── .env.example          # Environment Template
├── .gitignore            # Git exclusion rules
└── README.md             # Running instructions (This file)
```

---

## 2. Prerequisites & Environment Setup

Before running the application, make sure you have:
- **Node.js** (v16.0.0 or higher recommended)
- **MongoDB** running locally on default port `27017` (or MongoDB Atlas URI)

### Environment Variables
1. Create a `.env` file in the **project root folder** (same level as `backend/` and `frontend/`).
2. Add the following variables to it:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/hospital_db
   PORT=5000
   ```

---

## 3. Backend Setup & Run Command

1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   - For production / standard mode:
     ```bash
     npm start
     ```
     *(This runs `node server.js`)*
   - For development auto-reload mode (requires nodemon):
     ```bash
     npm run dev
     ```
4. The server runs at `http://localhost:5000`. It will automatically seed the database with initial doctors and patients if empty.

### Standalone Validation Test
To verify the MongoDB schema rules and validation errors (e.g., blood group constraints, character limits, missing fields):
```bash
node test-db.js
```

---

## 4. Frontend Setup & Run Command

1. Open a new terminal and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:3000`.

---

## 5. MongoDB Setup

- The system connects to MongoDB via the connection string in the `.env` file.
- If running locally, make sure your MongoDB instance is running:
  - **Windows Service**: `net start MongoDB` or verify in Windows Services.
- You can inspect the collections (`patients`, `doctors`, `appointments`) using MongoDB Compass by connecting to:
  `mongodb://127.0.0.1:27017/`
