// import {fetchUrls} ;

import { useState } from "react";

type Props = {
  onCreate: (data: any) => void;
  error: string;
};

const ShortUrlBox = ({ onCreate, error }: Props) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = () => {
    onCreate({ originalUrl, customCode });
    setOriginalUrl("");
    setCustomCode("");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Short URL</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Original URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Custom short code"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className=" border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Shorten
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
};

export default ShortUrlBox;
