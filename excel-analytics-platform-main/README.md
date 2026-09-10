# 📊 Excel Analytics Platform

A full-stack MERN application that allows users to upload Excel files, process their data, and create interactive data visualizations.

## 🚀 Features

- User Registration and Login
- JWT Authentication
- Excel File Upload
- Excel Data Processing
- Interactive Bar Charts
- Interactive Pie Charts
- Dynamic X-Axis and Y-Axis Selection
- User Dashboard
- View Excel Data
- Delete Records
- MongoDB Database Integration
- Responsive User Interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Chart.js
- React Chart.js 2

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Tools
- Git
- GitHub
- MongoDB Atlas
- XLSX for Excel Processing

## 📁 Project Structure

```text
excel-analytics-platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📊 How It Works

1. User creates an account or logs in.
2. User uploads an Excel file.
3. The Node.js backend receives the file.
4. Excel data is processed and stored using MongoDB.
5. The React dashboard retrieves the processed data.
6. Excel column names are automatically detected.
7. User selects columns for the X-Axis and Y-Axis.
8. Chart.js generates the visualization.
9. User can switch between Bar Chart and Pie Chart.

## 💻 Run the Project Locally

### 1. Clone Repository

```bash
git clone https://github.com/git-jagmohan/excel-analytics-platform.git
```

Move into the project:

```bash
cd excel-analytics-platform
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder and add your environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
npm start
```

The React application will open in your browser.

## 📈 Supported Analytics

The dashboard can visualize numerical Excel data using:

- Bar Charts
- Pie Charts
- Dynamic X-Axis selection
- Dynamic Y-Axis selection

Example Excel columns:

```text
Month | Sales | Expenses | Profit | Customers
```

Users can select:

```text
X-Axis → Month
Y-Axis → Sales
```

to generate a sales visualization.

## 🔐 Security

Sensitive information is stored using environment variables.

The following files/folders are excluded from GitHub:

```text
node_modules/
.env
build/
dist/
```

Never commit MongoDB credentials or JWT secrets to GitHub.

## 🔮 Future Improvements

- More chart types
- Download generated charts
- Advanced Excel analytics
- Saved analysis dashboards
- Improved file history
- Data filtering
- Export reports
- AI-powered data insights

## 👨‍💻 Author

**Jagmohan Singh**

GitHub: `git-jagmohan`

## 📌 Project Status

✅ Core Development Complete  
🚀 Ready for Deployment