import { useEffect, useState } from "react";
import {
  getUrls,
  updateOriginalUrl,
  updateShortCode,
  deleteUrl,
} from "../services/urlService";

const BASE_URL = "http://localhost:3000";

const UrlListBox = ({ newUrl }: any) => {
  const [urls, setUrls] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<
    "original_url" | "short_code" | null
  >(null);
  const [editValue, setEditValue] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUrls();
  }, [newUrl]);

  const fetchUrls = async () => {
    try {
      const data = await getUrls();
      setUrls(data);
    } catch {
      setError("Failed to fetch URLs.");
    }
  };

  const startEditing = (
    id: string,
    field: "original_url" | "short_code",
    currentValue: string
  ) => {
    setEditingId(id);
    setEditingField(field);
    setEditValue(currentValue);
    setConfirmingDeleteId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingField(null);
    setEditValue("");
  };

  const confirmEditing = async () => {
    try {
      if (editingId && editingField === "original_url") {
        await updateOriginalUrl(editingId, editValue);
      } else if (editingId && editingField === "short_code") {
        await updateShortCode(editingId, editValue);
      }
      cancelEditing();
      fetchUrls();
    } catch {
      setError("Failed to update. Possibly duplicate short code.");
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      fetchUrls();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete URL.");
    } finally {
      setConfirmingDeleteId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Original URL</th>
              <th className="px-4 py-3 font-medium">Short URL</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url: any) => (
              <tr key={url.id} className="border-t">
                <td className="px-4 py-3">
                  {editingId === url.id && editingField === "original_url" ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    url.original_url
                  )}
                </td>
                <td className="px-4 py-3 text-blue-600">
                  {editingId === url.id && editingField === "short_code" ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <a
                      href={`${BASE_URL}/${url.short_code}`}
                      target="_blank"
                      className="underline"
                    >
                      {BASE_URL}/{url.short_code}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                  {editingId === url.id ? (
                    <>
                      <button
                        onClick={confirmEditing}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : confirmingDeleteId === url.id ? (
                    <>
                      <button
                        onClick={() => confirmDelete(url.id)}
                        className="text-red-600  hover:underline"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          startEditing(url.id, "original_url", url.original_url)
                        }
                        className="text-yellow-600 hover:underline"
                      >
                        Edit URL
                      </button>
                      <button
                        onClick={() =>
                          startEditing(url.id, "short_code", url.short_code)
                        }
                        className="text-purple-600 hover:underline"
                      >
                        Edit Code
                      </button>
                      <button
                        onClick={() => {
                          setConfirmingDeleteId(url.id);
                          cancelEditing();
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {urls.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center px-4 py-6 text-gray-500">
                  No URLs created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
};

export default UrlListBox;
