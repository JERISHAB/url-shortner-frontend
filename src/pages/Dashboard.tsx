import { useEffect, useState } from "react";
import { createUrl, deleteUrl, getUrls } from "../services/urlService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

type Url = {
  id: string;
  short_code: string;
  original_url: string;
};

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUrls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUrls();
      setUrls(data);
    } catch {
      setError("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreate = async () => {
    setError(null);
    try {
      await createUrl(originalUrl, shortCode);
      setOriginalUrl("");
      setShortCode("");
      fetchUrls();
    } catch {
      setError("Failed to create URL");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      fetchUrls();
    } catch {
      setError("Failed to delete URL");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Dashboard</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Short Code (optional)"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          className="w-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      <ul className="divide-y divide-gray-300">
        {urls.map((url) => (
          <li key={url.id} className="flex justify-between items-center py-3">
            <div>
              <p>
                <span className="font-semibold">Short:</span>{" "}
                <a
                  href={`http://localhost:3000/${url.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {`http://localhost:3000/${url.short_code}`}
                </a>
              </p>
              <p>
                <span className="font-semibold">Original:</span>{" "}
                {url.original_url}
              </p>
            </div>
            <button
              onClick={() => handleDelete(url.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-8 block mx-auto text-red-600 underline"
      >
        Logout
      </button>
    </div>
  );
}
