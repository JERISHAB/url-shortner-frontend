import api from "./api";

export const getUrls = async () => {
  const res = await api.get("/urls");
  return res.data;
};

export const createUrl = async (originalUrl: string, customCode: string) => {
  return await api.post("/url/shorten", { originalUrl, customCode });
};

export const updateOriginalUrl = async (id: string, newUrl: string) => {
  return await api.put(`/url/${id}/edit-original/`, { newOriginalUrl: newUrl });
};

export const updateShortCode = async (id: string, newCode: string) => {
  return await api.put(`/url/${id}/edit-shortcode/`, {
    newShortCode: newCode,
  });
};

export const deleteUrl = async (id: string) => {
  return await api.delete(`/url/${id}`);
};
