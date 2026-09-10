import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ExcelBarChart from '../components/ExcelBarChart';
import ExcelPieChart from '../components/ExcelPieChart';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [userEmail, setUserEmail] = useState('');

  const BASE_URL = 'http://localhost:5000';

  // =========================
  // CHECK LOGIN
  // =========================
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.email || 'User');
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  // =========================
  // FETCH EXCEL DATA
  // =========================
  const fetchExcelData = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${BASE_URL}/api/excel/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Backend response:', res.data);

      /*
        Backend is returning records similar to:

        {
          data: {
            Month: "January",
            Sales: 52000,
            Expenses: 31000
          },
          user: "..."
        }

        We only need the Excel row inside "data".
      */

      const rows = Array.isArray(res.data)
        ? res.data
            .map((item) => item.data)
            .filter(
              (item) =>
                item &&
                typeof item === 'object' &&
                !Array.isArray(item)
            )
        : [];

      console.log('Extracted Excel rows:', rows);

      setExcelData(rows);

      if (rows.length > 0) {
        const keys = Object.keys(rows[0]);

        setHeaders(keys);

        // First column is normally category/text column
        setXAxis(keys[0]);

        // Find first numeric column for Y-axis
        const numericKey = keys.find((key) => {
          const value = rows[0][key];

          return (
            value !== null &&
            value !== '' &&
            !isNaN(Number(value))
          );
        });

        setYAxis(numericKey || keys[1] || keys[0]);
      } else {
        setHeaders([]);
        setXAxis('');
        setYAxis('');
      }
    } catch (err) {
      console.error(
        'Fetch error:',
        err.response?.data || err.message
      );
    }
  };

  // =========================
  // FETCH DATA ON LOAD
  // =========================
  useEffect(() => {
    fetchExcelData();
  }, []);

  // =========================
  // UPLOAD EXCEL FILE
  // =========================
  const handleUpload = async () => {
    if (!file) {
      alert('Please select an Excel file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${BASE_URL}/api/excel/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('File uploaded successfully!');

      // Refresh chart data
      await fetchExcelData();

      setFile(null);
    } catch (err) {
      console.error(
        'Upload error:',
        err.response?.data || err.message
      );

      alert('File upload failed.');
    }
  };

  // =========================
  // DELETE RECORDS
  // =========================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your records?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${BASE_URL}/api/excel/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExcelData([]);
      setHeaders([]);
      setXAxis('');
      setYAxis('');

      alert('Records deleted successfully!');
    } catch (err) {
      console.error(
        'Delete error:',
        err.response?.data || err.message
      );

      alert('Could not delete records.');
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-64 bg-white shadow-md p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📊 Excel Analytics
        </h2>

        <nav className="flex flex-col gap-3">

          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-4 py-2 rounded text-left"
          >
            Dashboard
          </Link>

          <Link
            to="/upload"
            className="text-left text-gray-700 hover:text-blue-600"
          >
            Upload File
          </Link>

          <Link
            to="/files"
            className="text-left text-gray-700 hover:text-blue-600"
          >
            My Files
          </Link>

          <Link
            to="/saved"
            className="text-left text-gray-700 hover:text-blue-600"
          >
            Saved Analyses
          </Link>

          <Link
            to="/profile"
            className="text-left text-gray-700 hover:text-blue-600"
          >
            Profile
          </Link>

        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 p-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-semibold">
            Welcome,{' '}
            <span className="text-blue-600">
              {userEmail}
            </span>
            !
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="mb-6">

          <h2 className="text-xl font-semibold mb-2">
            📋 Quick Summary
          </h2>

          <div className="bg-white p-4 rounded shadow w-48 text-center">

            <p className="text-2xl font-bold">
              {excelData.length}
            </p>

            <p className="text-gray-500 text-sm">
              Total Data Rows
            </p>

          </div>

        </div>

        {/* ================= FILE UPLOAD ================= */}

        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center">

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>

          <button
            onClick={fetchExcelData}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Refresh Data
          </button>

          <button
            onClick={handleDelete}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Delete Records
          </button>

        </div>

        {/* ================= CHART CONTROLS ================= */}

        {headers.length > 0 && (

          <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center">

            {/* X AXIS */}

            <div>

              <label className="block text-sm font-semibold mb-1">
                X-Axis:
              </label>

              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="border p-2 rounded"
              >

                {headers.map((head) => (

                  <option
                    key={head}
                    value={head}
                  >
                    {head}
                  </option>

                ))}

              </select>

            </div>

            {/* Y AXIS */}

            <div>

              <label className="block text-sm font-semibold mb-1">
                Y-Axis:
              </label>

              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="border p-2 rounded"
              >

                {headers.map((head) => (

                  <option
                    key={head}
                    value={head}
                  >
                    {head}
                  </option>

                ))}

              </select>

            </div>

            {/* CHART TYPE */}

            <button
              onClick={() =>
                setChartType(
                  chartType === 'bar'
                    ? 'pie'
                    : 'bar'
                )
              }
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Toggle Chart (
              {chartType === 'bar'
                ? 'Pie'
                : 'Bar'}
              )
            </button>

          </div>

        )}

        {/* ================= CHART ================= */}

        <div className="bg-white p-6 rounded shadow">

          {excelData.length > 0 &&
          xAxis &&
          yAxis ? (

            chartType === 'bar' ? (

              <ExcelBarChart
                chartData={excelData}
                xAxis={xAxis}
                yAxis={yAxis}
              />

            ) : (

              <ExcelPieChart
                chartData={excelData}
                xAxis={xAxis}
                yAxis={yAxis}
              />

            )

          ) : (

            <p className="text-gray-500 text-center">
              No chart data available.
            </p>

          )}

        </div>

      </main>

    </div>
  );
};

export default Dashboard;