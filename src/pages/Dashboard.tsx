import { useState } from "react";
import { getUrls, createUrl } from "../services/urlService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import ShortUrlBox from "../components/ShortUrlBox";
import UrlListBox from "../components/UrlListBox";
// import { useMutation, useQuery, useQueryClient } from "react-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  // const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  

  // useEffect(() => {
  //   fetchUrls();

  // }, []);

  //   const  fetchUrls = async () => {
  //   try {
  //     const data = await getUrls();
  //     setUrls(data);
  //   } catch {
  //     setError("Failed to fetch URLs.");
  //   }
  // };

  const { data: urls = [], isLoading, isError } = useQuery({
  queryKey: ["urls"],
  queryFn: getUrls,
  });
  
  const createMutation = useMutation({
    mutationFn: ({ originalUrl, customCode }: any) =>
      createUrl(originalUrl, customCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] }); 
      setError("");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.errors?.[0]?.message || "Failed to create URL";
      setError(message);
    },
  });

  
  const handleCreate = (data: { originalUrl: string; customCode: string }) => {
    createMutation.mutate(data);
    console.log(data)
  };
  

  // const handleCreate = async ({ originalUrl, customCode }: any) => {
  //   try {
  //     await createUrl(originalUrl, customCode);
  //     setError("");
  //     fetchUrls();
  //   } catch (err: any) {
  //     setError(err.response.data.errors[0].message);
  //   }
  // };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        <ShortUrlBox onCreate={handleCreate} error={error} />

        {isLoading ? (
          <p className="text-center text-gray-500 mt-6">Loading URLs...</p>
        ) : isError ? (
          <p className="text-center text-red-500 mt-6">
            Error fetching URLs.
          </p>
        ) : (
          <UrlListBox newUrl={urls} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
