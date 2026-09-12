import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const BASE_URL =
    'https://excel-analytics-platform-9lmy.onrender.com';

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an Excel file');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setMessage('');

      const res = await axios.post(
        `${BASE_URL}/api/excel/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `✅ ${res.data.records} records uploaded successfully`
      );

      setFile(null);

    } catch (err) {
      console.error(
        'Upload error:',
        err.response?.data || err.message
      );

      setMessage(
        `❌ ${
          err.response?.data?.msg ||
          'Upload failed'
        }`
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          📤 Upload File
        </h1>

        <Link
          to="/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Dashboard
        </Link>

      </div>

      <div className="bg-white p-6 rounded shadow max-w-xl">

        <h2 className="text-lg font-semibold mb-4">
          Select Excel File
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setMessage('');
          }}
          className="block w-full border p-3 rounded mb-4"
        />

        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}

      </div>

    </div>
  );
};

export default Upload;