import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // USER INPUT STATE
  const [formData, setFormData] = useState({
    duration: "",
    src_bytes: "",
    dst_bytes: ""
  });

  const [result, setResult] = useState("");
  const [logs, setLogs] = useState([]);

  // ADMIN STATE
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  // LOGIN HANDLER
  const handleLogin = () => {
    if (loginData.username === "user" && loginData.password === "1234") {
      setRole("user");
      setIsLoggedIn(true);
    } else if (loginData.username === "admin" && loginData.password === "admin123") {
      setRole("admin");
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials ❌");
    }
  };

  // USER INPUT HANDLER
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // PREDICTION
  const handlePredict = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        duration: Number(formData.duration),
        src_bytes: Number(formData.src_bytes),
        dst_bytes: Number(formData.dst_bytes)
      });

      const prediction = res.data.prediction;
      setResult(prediction);

      // Add to logs
      const newLog = {
        time: new Date().toLocaleTimeString(),
        prediction
      };
      setLogs([newLog, ...logs]);

    } catch {
      setResult("Error ❌");
    }
  };

  // ADMIN FUNCTIONS (DUMMY FOR NOW)
  const handleUpload = () => {
    if (file) {
      setStatus("Dataset selected: " + file.name + " ✅");
    } else {
      setStatus("No file selected ❌");
    }
  };

  const handleTrain = () => {
    setStatus("Model training started... ");
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="panel login-box">
          <h2>Login</h2>

          <input
            placeholder="Username"
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <button onClick={handleLogin}>Login</button>

          <p className="hint">
            user / 1234 <br />
            admin / admin123
          </p>
        </div>
      </div>
    );
  }

  // AFTER LOGIN
  return (
    <div className="container">

      <h1>AI-Based Intrusion Detection System</h1>
      <h3>Logged in as: {role.toUpperCase()}</h3>

      {/* USER PANEL */}
      {role === "user" && (
        <div className="panel">
          <h2>User Dashboard</h2>

          <form onSubmit={handlePredict}>
            <input
              name="duration"
              placeholder="Duration"
              onChange={handleChange}
              required
            />

            <input
              name="src_bytes"
              placeholder="Source Bytes"
              onChange={handleChange}
              required
            />

            <input
              name="dst_bytes"
              placeholder="Destination Bytes"
              onChange={handleChange}
              required
            />

            <button type="submit">Predict</button>
          </form>

          {result && (
            <div
              className={`result ${
                result === "Attack" ? "attack" : "normal"
              }`}
            >
              Prediction: {result}
              {result === "Attack" && <p>⚠ Alert Generated</p>}
            </div>
          )}
        </div>
      )}

      {/* ADMIN PANEL */}
      {role === "admin" && (
        <div className="panel">
          <h2>Admin Dashboard</h2>

          {/* Upload Dataset */}
          <div className="admin-section">
            <h3>Upload Dataset</h3>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload Dataset</button>
          </div>

          {/* Train Model */}
          <div className="admin-section">
            <h3>Train ML Model</h3>
            <button onClick={handleTrain}>Train Model</button>
          </div>

          {/* Manage Users */}
          <div className="admin-section">
            <h3>Manage Users</h3>
            <ul>
              <li>👤 user (active)</li>
              <li>👨‍💻 admin (active)</li>
            </ul>
          </div>

          {/* Status */}
          {status && <div className="status">{status}</div>}

          {/* Logs */}
          <div className="admin-section">
            <h3>Logs</h3>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Prediction</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.time}</td>
                    <td
                      className={
                        log.prediction === "Attack"
                          ? "attack-text"
                          : "normal-text"
                      }
                    >
                      {log.prediction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;