import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

const SavedAnalyses = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BASE_URL =
    'https://excel-analytics-platform-9lmy.onrender.com';

  // =========================
  // CHECK USER
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

      const token = localStorage.getItem('token');

      const res = await axios.get(
        `${BASE_URL}/api/excel/saved-analyses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalyses(
        Array.isArray(res.data) ? res.data : []
      );

    } catch (err) {
      console.error(
        'Failed to fetch saved analyses:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.msg ||
        'Failed to load saved analyses.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          📁 Saved Analyses
        </h1>

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Dashboard
        </Link>

      </div>

      {/* USER */}

      <p className="text-gray-600 mb-6">
        Saved analyses for{' '}
        <span className="font-semibold text-blue-600">
          {userEmail}
        </span>
      </p>

      {/* LOADING */}

      {loading && (
        <p className="text-gray-600">
          Loading saved analyses...
        </p>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* NO ANALYSES */}

      {!loading &&
        !error &&
        analyses.length === 0 && (
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">
              No saved analyses found.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Create a chart on the Dashboard and
              click "Save Analysis".
            </p>
          </div>
        )}

      {/* SAVED ANALYSES */}

      {!loading &&
        !error &&
        analyses.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {analyses.map((analysis, index) => (

              <div
                key={analysis._id || index}
                className="bg-white p-5 rounded shadow"
              >

                <h2 className="text-lg font-semibold mb-3 text-blue-700">
                  {analysis.name ||
                    `Analysis #${index + 1}`}
                </h2>

                <p className="mb-1">
                  <strong>X-Axis:</strong>{' '}
                  {analysis.xAxis}
                </p>

                <p className="mb-1">
                  <strong>Y-Axis:</strong>{' '}
                  {analysis.yAxis}
                </p>

                <p className="mb-1">
                  <strong>Chart Type:</strong>{' '}
                  {analysis.chartType}
                </p>

                {analysis.createdAt && (
                  <p className="text-sm text-gray-400 mt-3">
                    Saved:{' '}
                    {new Date(
                      analysis.createdAt
                    ).toLocaleString()}
                  </p>
                )}

              </div>

            ))}

          </div>
        )}

    </div>
  );
};

export default SavedAnalyses;