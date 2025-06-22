import { useState } from "react";
import { getUrls, createUrl } from "../services/urlService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import ShortUrlBox from "../components/ShortUrlBox";
import UrlListBox from "../components/UrlListBox";
// import { useMutation, useQuery, useQueryClient } from "react-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./Dashboard.css";



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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <ShortUrlBox onCreate={handleCreate} error={error} />

      {isLoading && <p className="message">Loading URLs...</p>}
      {isError && <p className="message error">Error fetching URLs.</p>}
      {!isLoading && !isError && <UrlListBox />}
    </div>
  );
};

export default Dashboard;
