import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function StoreDashboard() {
  const { token } = useAuth();
  const [avg, setAvg] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .storeAvg(token)
      .then(setAvg)
      .catch((e) => setErr(String(e.message || e)));
    api
      .storeRaters(token)
      .then(setUsers)
      .catch((e) => setErr(String(e.message || e)));
  }, [token]);

  return (
    <div className="grid">
      <div className="card">
        <h2>Store Dashboard</h2>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <p className="muted">Average rating:</p>
        <div style={{ fontSize: 22, marginTop: 6 }}>
          <Stars score={avg?.averageRating} />
        </div>
        {/* <div style={{ marginTop: 12 }}>
          <Link to="/store/resetpassword" className="pill">
            Reset password
          </Link>
        </div> */}
      </div>
      <div className="card">
        <h3>Users Who Rated</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <Stars score={u.score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stars({ score = 0 }) {
  const n = Math.round(score || 0);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "on" : ""}>
          {i <= n ? "★" : "☆"}
        </span>
      ))}
      <span style={{ marginLeft: 6 }}>
        {score?.toFixed ? score.toFixed(1) : score}
      </span>
    </span>
  );
}
