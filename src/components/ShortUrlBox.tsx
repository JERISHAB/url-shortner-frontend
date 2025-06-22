import "./ShortUrlBox.css"

// import {fetchUrls} ;

import { useState } from "react";

type Props = {
  onCreate: (data: any) => void;
  error: string;
};
 
const ShortUrlBox = ({ onCreate, error }: Props) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    onCreate({ originalUrl, customCode });
    setOriginalUrl("");
    setCustomCode("");
  };

  return (
    <div className="short-url-box">
      <h2>Create Short URL</h2>
      <div className="short-url-form">
        <input
          type="text"
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="short-url-input original"
        />
        <input
          type="text"
          placeholder="Custom short code"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="short-url-input custom"
        />
        <button onClick={handleSubmit} className="short-url-button">
          Shorten
        </button>
      </div>
      {error && <p className="short-url-error">{error}</p>}
    </div>
  );
};

export default ShortUrlBox;
