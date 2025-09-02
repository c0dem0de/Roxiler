import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserStores() {
  const { token, user } = useAuth();
  const [q, setQ] = useState("");
  const [stores, setStores] = useState([]);
  const [err, setErr] = useState("");

  const load = () =>
    api
      .userStores(token, q)
      .then(setStores)
      .catch((e) => setErr(String(e.message || e)));

  useEffect(() => {
    if (token) load();
  }, [token]);

  const rate = async (id, score, method = "POST") => {
    try {
      await api.userRate(token, id, score, method);
      await load();
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Stores</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            placeholder="Search name/address"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={load}>Search</button>
          {/* {user?.role === "user" && (
            <Link to="/user/resetpassword" className="pill">
              Reset password
            </Link>
          )} */}
        </div>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <table style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Overall</th>
              <th>Your</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>
                  <Stars score={s.overallRating} />
                </td>
                <td>
                  <Stars score={s.userRating} />
                </td>
                <td>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        rate(s.id, n, s.userRating ? "PATCH" : "POST")
                      }
                      title={s.userRating ? "Update rating" : "Add rating"}
                      style={{ marginRight: 6 }}>
                      {n}
                    </button>
                  ))}
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
