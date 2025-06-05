import {useEffect,useState } from "react";
import {getUrls,createUrl} from "../services/urlService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import ShortUrlBox from "../components/ShortUrlBox";
import UrlListBox from "../components/UrlListBox";

const Dashboard = () => {
   const [urls, setUrls] = useState([]);
   const [error, setError] = useState("");
   const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

    const  fetchUrls = async () => {
    try {
      const data = await getUrls();
      setUrls(data);
    } catch {
      setError("Failed to fetch URLs.");
    }
  };

  const handleCreate =  ({ originalUrl, customCode }: any) => {
    try {
      createUrl(originalUrl, customCode);
      setError("");
      fetchUrls();
    } catch (err: any) {
      setError(err.response.data.errors[0].message);
    }
  };

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
        
        <UrlListBox newUrl={urls} />

      </div>
    </div>
  );
};

export default Dashboard;

