# PowerUp - Exercise Simulator

**PowerUp - Exercise Simulator** is a full-stack web application designed to help users simulate and track various exercises. The application allows users to input exercise names as queries and receive corresponding exercise simulations. The backend is built with Node.js and Express.js, while the frontend utilizes modern web technologies for an interactive user experience.

---

## 🚀 Features

- **Exercise Query**: Input the name of an exercise to simulate and track.
- **Real-time Simulation**: Visual representation of exercises based on user input.
- **User-Friendly Interface**: Intuitive design for easy navigation and interaction.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment Variables**: Managed using `.env` files

---

## 📁 Project Structure

```
exercise-simulator/
├── client/               # Frontend source code
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server/               # Backend source code
│   ├── index.js
│   ├── routes/
│   └── models/
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local or cloud instance)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/exercise-simulator.git
   cd exercise-simulator
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file inside the `server` directory.
   - Add the following line, replacing `<your_mongo_uri>` with your actual MongoDB connection string:
     ```
     MONGOURI=<your_mongo_uri>
     ```

3. **Start the Backend Server**:
   ```bash
   cd server
   npm install
   node index.js
   ```
   - The backend server will start on `http://localhost:5000`.

4. **Start the Frontend**:
   ```bash
   cd ../client
   npm install
   npm audit fix --force   # Optional
   npm run dev
   ```
   - The frontend will be accessible at `http://localhost:5173`.

---

## 🧪 Usage

- Navigate to `http://localhost:5173` in your browser.
- Enter the name of an exercise in the query input field.
- The application will simulate the entered exercise.

---

## 📦 Deployment

To deploy the application:

1. **Backend Deployment**:
   - Ensure your `MONGOURI` is set appropriately in the `.env` file.
   - Deploy the `server` directory to your preferred hosting service (e.g., Heroku, Render).

2. **Frontend Deployment**:
   - Build the frontend for production:
     ```bash
     npm run build
     ```
   - Deploy the contents of the `dist` directory to a static hosting service (e.g., Netlify, Vercel).

---

## 📝 Notes

- Ensure that the `MONGOURI` in the `.env` file is correctly set to connect to your MongoDB instance.
- The application relies on the exercise name input to simulate exercises; ensure accurate spelling for best results.

---
