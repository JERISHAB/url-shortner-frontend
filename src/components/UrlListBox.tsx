import { useState } from "react";
import {
  getUrls,
  updateOriginalUrl,
  updateShortCode,
  deleteUrl,
} from "../services/urlService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "./UrlListBox.css";

// type Url = {
//     id: number,
//     short_code: string,
//     original_url: string
//     created_at: string
//     user_id: number
// }
// type newUrl = {
//     newUrl: Url[]
// }

const BASE_URL = "http://localhost:3000";

const UrlListBox = () => {
  const [editing, setEditing] = useState<{
    id: string;
    field: "original_url" | "short_code";
    value: string;
  } | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   fetchUrls();
  // }, [newUrl]);

  const { data: urls = [] } = useQuery({
    queryKey: ["urls"],
    queryFn: getUrls,
  });

  // const fetchUrls = async () => {
  //   try {
  //     const data = await getUrls();
  //     setUrls(data);
  //   } catch {
  //     setError("Failed to fetch URLs.");
  //   }
  // };

  const startEditing = (
    id: string,
    field: "original_url" | "short_code",
    currentValue: string
  ) => {
    setEditing({ id, field, value: currentValue });
    setConfirmingDeleteId(null);
  };

  const cancelEditing = () => {
    setEditing(null);
  };

  const editMutationOriginal = useMutation({
    mutationFn: ({ editingId, editValue }: any) =>
      updateOriginalUrl(editingId, editValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setError("");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to edit original Url";
      setError(message);
    },
  });

  const editMutationShortcode = useMutation({
    mutationFn: ({ editingId, editValue }: any) =>
      updateShortCode(editingId, editValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setError("");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to edit short code";
      setError(message);
    },
  });

  const confirmEditing = async () => {
    if (!editing) return;

    const data = {
      editingId: editing.id,
      editingField: editing.field,
      editValue: editing.value,
    };

    if (editing.field === "original_url") {
      editMutationOriginal.mutate(data);
    } else if (editing.field === "short_code") {
      editMutationShortcode.mutate(data);
    }

    cancelEditing();
  };

  // const confirmEditing = async () => {
  //   try {
  //     if (editingId && editingField === "original_url") {
  //       await updateOriginalUrl(editingId, editValue);
  //     } else if (editingId && editingField === "short_code") {
  //       await updateShortCode(editingId, editValue);
  //     }
  //     cancelEditing();
  //   } catch {
  //     setError("Failed to update. Possibly duplicate short code.");
  //   }
  // };

  // const confirmDelete = async (id: string) => {
  //   try {
  //     await deleteUrl(id);
  //   } catch (err) {
  //     console.error("Failed to delete:", err);
  //     setError("Failed to delete URL.");
  //   } finally {
  //     setConfirmingDeleteId(null);
  //   }
  // };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setError("");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.errors?.[0]?.message || "Failed to delete URL";
      setError(message);
    },
  });

  const confirmDelete = (id: string) => {
    deleteMutation.mutate(id);
    console.log(id);
  };

  return (
    <div className="container">
      <table className="url-table">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url: any) => (
            <tr key={url.id}>
              <td>
                {editing?.id === url.id && editing?.field === "original_url" ? (
                  <input
                    className="edit-input"
                    value={editing.value}
                    onChange={(e) =>
                      setEditing({ ...editing, value: e.target.value })
                    }
                  />
                ) : (
                  url.original_url
                )}
              </td>
              <td>
                {editing?.id === url.id && editing?.field === "short_code" ? (
                  <input
                    className="edit-input"
                    value={editing.value}
                    onChange={(e) =>
                      setEditing({ ...editing, value: e.target.value })
                    }
                  />
                ) : (
                  <a
                    href={`${BASE_URL}/${url.short_code}`}
                    target="_blank"
                    className="short-link"
                  >
                    {BASE_URL}/{url.short_code}
                  </a>
                )}
              </td>
              <td>
                {editing?.id === url.id ? (
                  <>
                    <button onClick={confirmEditing} className="btn green">
                      Save
                    </button>
                    <button onClick={cancelEditing} className="btn gray">
                      Cancel
                    </button>
                  </>
                ) : confirmingDeleteId === url.id ? (
                  <>
                    <button
                      onClick={() => confirmDelete(url.id)}
                      className="btn red"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(null)}
                      className="btn gray"
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
                      className="btn yellow"
                    >
                      Edit URL
                    </button>
                    <button
                      onClick={() =>
                        startEditing(url.id, "short_code", url.short_code)
                      }
                      className="btn purple"
                    >
                      Edit Code
                    </button>
                    <button
                      onClick={() => {
                        setConfirmingDeleteId(url.id);
                        cancelEditing();
                      }}
                      className="btn red"
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
              <td colSpan={3} className="empty">
                No URLs created yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UrlListBox;
