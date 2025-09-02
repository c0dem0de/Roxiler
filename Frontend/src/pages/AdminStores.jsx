import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminStores() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .adminStores(token)
      .then(setStores)
      .catch((e) => setErr(String(e.message || e)));
  }, [token]);

  return (
    <div className="card">
      <h2>Stores</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Avg</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>
                <Stars score={s.rating} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
