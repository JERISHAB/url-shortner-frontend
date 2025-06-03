import React, { useEffect, useState } from "react";
import {
  getUrls,
  createUrl,
  updateOriginalUrl,
  updateShortCode,
  deleteUrl,
} from "../services/urlService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const data = await getUrls();
      setUrls(data);
    } catch {
      setError("Failed to fetch URLs.");
    }
  };

  const handleCreate = async () => {
    try {
      await createUrl(originalUrl, customCode);
      setOriginalUrl("");
      setCustomCode("");
      setError("");
      fetchUrls();
    } catch {
      setError("Failed to create URL. Maybe short code already exists.");
    }
  };

  const handleEditOriginal = async (id: string, current: string) => {
    const newUrl = prompt("Edit original URL:", current);
    if (newUrl && newUrl !== current) {
      await updateOriginalUrl(id, newUrl);
      fetchUrls();
    }
  };

  const handleEditShort = async (id: string, current: string) => {
    const newCode = prompt("Edit short code:", current);
    if (newCode && newCode !== current) {
      await updateShortCode(id, newCode);
      fetchUrls();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUrl(id);
    fetchUrls();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Original URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full md:w-2/3"
            />
            <input
              type="text"
              placeholder="Custom short code"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full md:w-1/3"
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Shorten
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Original URL</th>
                <th className="text-left px-4 py-3">Short URL</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url: any) => (
                <tr key={url.id} className="border-t">
                  <td className="px-4 py-3">{url.original_url}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`${BASE_URL}/${url.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {BASE_URL}/{url.short_code}
                    </a>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() =>
                        handleEditOriginal(url.id, url.original_url)
                      }
                      className="text-yellow-600 hover:underline"
                    >
                      Edit URL
                    </button>
                    <button
                      onClick={() => handleEditShort(url.id, url.short_code)}
                      className="text-purple-600 hover:underline"
                    >
                      Edit Code
                    </button>
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {urls.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center px-4 py-6 text-gray-500"
                  >
                    No URLs created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
