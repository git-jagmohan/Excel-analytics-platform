import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

import ExcelBarChart from '../components/ExcelBarChart';
import ExcelPieChart from '../components/ExcelPieChart';

const SavedAnalyses = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BASE_URL =
    'https://excel-analytics-platform-9lmy.onrender.com';

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

      setUserEmail(
        decoded.email || 'User'
      );

    } catch (err) {
      console.error(
        'Invalid token:',
        err
      );

      localStorage.removeItem('token');
      localStorage.removeItem('role');

      navigate('/login');

      return;
    }

    fetchAnalyses();

  }, [navigate]);

  // =========================
  // FETCH SAVED ANALYSES
  // =========================
  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');

      const token =
        localStorage.getItem('token');

      const res = await axios.get(
        `${BASE_URL}/api/excel/saved-analyses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        'Saved analyses:',
        res.data
      );

      setAnalyses(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {
      console.error(
        'Failed to fetch saved analyses:',
        err.response?.data ||
          err.message
      );

      setError(
        err.response?.data?.msg ||
          'Failed to load saved analyses.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGE
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            📁 Saved Analyses
          </h1>

          <p className="text-gray-600 mt-1">
            Saved analyses for{' '}
            <span className="font-semibold text-blue-600">
              {userEmail}
            </span>
          </p>
        </div>

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Dashboard
        </Link>

      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-600">
            Loading saved analyses...
          </p>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        !error &&
        analyses.length === 0 && (

          <div className="bg-white p-6 rounded shadow">

            <p className="text-gray-600">
              No saved analyses found.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Create a chart on the Dashboard
              and click "Save Analysis".
            </p>

          </div>

        )}

      {/* ================= ANALYSES ================= */}

      {!loading &&
        !error &&
        analyses.length > 0 && (

          <div className="grid grid-cols-1 gap-6">

            {analyses.map(
              (analysis, index) => (

                <div
                  key={
                    analysis._id ||
                    index
                  }
                  className="bg-white p-6 rounded shadow"
                >

                  {/* ANALYSIS NAME */}

                  <h2 className="text-xl font-semibold mb-4 text-blue-700">
                    {analysis.name ||
                      `Analysis #${index + 1}`}
                  </h2>

                  {/* ANALYSIS INFORMATION */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

                    <div className="bg-gray-50 p-3 rounded">

                      <p className="text-sm text-gray-500">
                        X-Axis
                      </p>

                      <p className="font-semibold">
                        {analysis.xAxis}
                      </p>

                    </div>

                    <div className="bg-gray-50 p-3 rounded">

                      <p className="text-sm text-gray-500">
                        Y-Axis
                      </p>

                      <p className="font-semibold">
                        {analysis.yAxis}
                      </p>

                    </div>

                    <div className="bg-gray-50 p-3 rounded">

                      <p className="text-sm text-gray-500">
                        Chart Type
                      </p>

                      <p className="font-semibold capitalize">
                        {analysis.chartType}
                      </p>

                    </div>

                  </div>

                  {/* ================= SAVED CHART ================= */}

                  <div className="border rounded p-4">

                    <h3 className="font-semibold mb-4">
                      📊 Chart
                    </h3>

                    {analysis.chartData &&
                    analysis.chartData.length > 0 ? (

                      <div className="w-full">

                        {analysis.chartType ===
                        'bar' ? (

                          <ExcelBarChart
                            chartData={
                              analysis.chartData
                            }
                            xAxis={
                              analysis.xAxis
                            }
                            yAxis={
                              analysis.yAxis
                            }
                          />

                        ) : (

                          <ExcelPieChart
                            chartData={
                              analysis.chartData
                            }
                            xAxis={
                              analysis.xAxis
                            }
                            yAxis={
                              analysis.yAxis
                            }
                          />

                        )}

                      </div>

                    ) : (

                      <div className="bg-yellow-50 p-4 rounded">

                        <p className="text-yellow-700 text-sm">
                          No chart data was saved
                          with this analysis.
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          This analysis may have
                          been created before chart
                          data saving was added.
                        </p>

                      </div>

                    )}

                  </div>

                  {/* ================= DATE ================= */}

                  {analysis.createdAt && (

                    <p className="text-sm text-gray-400 mt-4">

                      Saved:{' '}

                      {new Date(
                        analysis.createdAt
                      ).toLocaleString()}

                    </p>

                  )}

                </div>

              )
            )}

          </div>

        )}

    </div>
  );
};

export default SavedAnalyses;