import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "https://samadhan-setu-vu3l.onrender.com";

const statuses = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
];

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] =
    useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();

      if (data.success) {
        setComplaints(data.complaints || []);
      } else {
        setError("Unable to load complaints.");
      }
    } catch (err) {
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (complaintId, status) => {
    setUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setComplaints((prev) =>
          prev.map((item) =>
            item.complaint_id === complaintId
              ? data.complaint
              : item
          )
        );

        setSelectedComplaint(data.complaint);
      } else {
        alert(data.message || "Status update failed.");
      }
    } catch (err) {
      alert("Unable to connect to backend.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const text =
        `${complaint.complaint_id} ${complaint.full_name} ${complaint.category} ${complaint.description}`
          .toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(
      (c) => c.status === "Submitted"
    ).length,
    review: complaints.filter(
      (c) => c.status === "Under Review"
    ).length,
    progress: complaints.filter(
      (c) => c.status === "In Progress"
    ).length,
    resolved: complaints.filter(
      (c) => c.status === "Resolved"
    ).length,
  };

  return (
    <div className="admin-page">

      <header className="admin-header">
        <div>
          <h1>SamadhanSetu Admin</h1>
          <p>Complaint Management Dashboard</p>
        </div>

        <div className="admin-user">
          <button onClick={loadComplaints}>
            🔄 Refresh
          </button>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="admin-content">

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-card">
            <span>Submitted</span>
            <strong>{stats.submitted}</strong>
          </div>

          <div className="stat-card">
            <span>Under Review</span>
            <strong>{stats.review}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{stats.progress}</strong>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>

        </div>

        {/* COMPLAINTS */}
        <section className="complaints-panel">

          <div className="panel-heading">
            <div>
              <h2>Complaints</h2>
              <p>
                Manage citizen complaints from one place.
              </p>
            </div>
          </div>

          <div className="filters">

            <input
              className="search-box"
              type="text"
              placeholder="Search complaint..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state">
              No complaints found.
            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredComplaints.map(
                    (complaint) => (
                      <tr key={complaint.complaint_id}>

                        <td>
                          <strong>
                            {complaint.complaint_id}
                          </strong>
                        </td>

                        <td>
                          {complaint.full_name}
                        </td>

                        <td>
                          {complaint.category}
                        </td>

                        <td>
                          <span className="status-badge">
                            {complaint.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelectedComplaint(
                                complaint
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>
      </main>

      {/* MODAL */}
      {selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedComplaint(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={() =>
                setSelectedComplaint(null)
              }
            >
              ×
            </button>

            <h2>
              Complaint Details
            </h2>

            <div className="detail-section">

              <p>
                <strong>ID:</strong>{" "}
                {selectedComplaint.complaint_id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedComplaint.full_name}
              </p>

              <p>
                <strong>Mobile:</strong>{" "}
                {selectedComplaint.mobile}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {selectedComplaint.category}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedComplaint.description}
              </p>

              <p>
                <strong>Current Status:</strong>{" "}
                {selectedComplaint.status}
              </p>

            </div>

            <h3>Update Status</h3>

            <div className="status-actions">

              {statuses.map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  className={
                    selectedComplaint.status === status
                      ? "active-status"
                      : ""
                  }
                  onClick={() =>
                    updateStatus(
                      selectedComplaint.complaint_id,
                      status
                    )
                  }
                >
                  {status}
                </button>
              ))}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;