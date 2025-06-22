import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./Register.css"

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("User already exists. Try logging in.");
      } else if (err.response?.status === 400) {
        setError("Please fill all fields correctly.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
