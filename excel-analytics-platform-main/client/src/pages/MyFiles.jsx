import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyFiles = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BASE_URL =
    'https://excel-analytics-platform-9lmy.onrender.com';

  // =========================
  // FETCH USER DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = await axios.get(
          `${BASE_URL}/api/excel/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Backend returns:
        // [
        //   {
        //     _id: "...",
        //     user: "...",
        //     data: {
        //       Month: "January",
        //       Sales: 5000
        //     }
        //   }
        // ]

        const rows = Array.isArray(res.data)
          ? res.data
              .map((record) => record.data)
              .filter(
                (row) =>
                  row &&
                  typeof row === 'object' &&
                  !Array.isArray(row)
              )
          : [];

        setRecords(rows);

      } catch (err) {
        console.error(
          'Fetch error:',
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.msg ||
          'Failed to load Excel data.'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-semibold">
            📁 My Files
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Your uploaded Excel data
          </p>
        </div>

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Dashboard
        </Link>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">
            Loading data...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* NO DATA */}

      {!loading &&
        !error &&
        records.length === 0 && (

          <div className="bg-white p-6 rounded shadow">

            <p className="text-gray-500">
              No uploaded Excel data found.
            </p>

            <Link
              to="/dashboard"
              className="inline-block mt-4 text-blue-600 underline"
            >
              Upload an Excel file
            </Link>

          </div>
        )}

      {/* DATA TABLE */}

      {!loading &&
        !error &&
        records.length > 0 && (

          <div className="bg-white rounded shadow overflow-hidden">

            <div className="p-4 border-b">

              <h2 className="font-semibold">
                Excel Data
              </h2>

              <p className="text-sm text-gray-500">
                {records.length} rows
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full table-auto">

                <thead>

                  <tr className="bg-gray-200">

                    {Object.keys(records[0]).map(
                      (header) => (

                        <th
                          key={header}
                          className="p-3 border text-left text-sm"
                        >
                          {header}
                        </th>

                      )
                    )}

                  </tr>

                </thead>

                <tbody>

                  {records.map(
                    (row, rowIndex) => (

                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50"
                      >

                        {Object.keys(records[0]).map(
                          (header) => (

                            <td
                              key={header}
                              className="p-3 border text-sm"
                            >

                              {row[header] !==
                                undefined &&
                              row[header] !== null
                                ? String(row[header])
                                : '-'}

                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

    </div>
  );
};

export default MyFiles;