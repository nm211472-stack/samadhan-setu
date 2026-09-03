import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:8000";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  // -----------------------------
  // Load complaints
  // -----------------------------

  const loadComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/complaints`);

      if (!response.ok) {
        throw new Error("Failed to load complaints");
      }

      const data = await response.json();

      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Could not connect to backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // -----------------------------
  // Update complaint status
  // -----------------------------

  const updateStatus = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);

      const response = await fetch(
        `${API_URL}/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      const data = await response.json();

      if (data.success) {
        setComplaints((previous) =>
          previous.map((complaint) =>
            complaint.complaint_id === complaintId
              ? data.complaint
              : complaint
          )
        );

        setSelectedComplaint(data.complaint);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to update complaint status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // -----------------------------
  // Search + filter
  // -----------------------------

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.complaint_id
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.full_name
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.category
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        filterStatus === "All" ||
        complaint.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, filterStatus]);

  // -----------------------------
  // Dashboard statistics
  // -----------------------------

  const total = complaints.length;

  const submitted = complaints.filter(
    (c) => c.status === "Submitted"
  ).length;

  const underReview = complaints.filter(
    (c) => c.status === "Under Review"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  // -----------------------------
  // Logout
  // -----------------------------

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-brand">
          <div className="admin-logo">🇮🇳</div>

          <div>
            <h2>SamadhanSetu</h2>
            <span>Administration Portal</span>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-user">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* Page title */}

        <div className="admin-title">

          <div>
            <span className="admin-label">
              ADMIN CONTROL CENTER
            </span>

            <h1>Complaint Dashboard</h1>

            <p>
              Monitor, review and manage citizen complaints.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadComplaints}
          >
            🔄 Refresh
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <span>Total Complaints</span>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📨</div>

            <div>
              <span>Submitted</span>
              <strong>{submitted}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔍</div>

            <div>
              <span>Under Review</span>
              <strong>{underReview}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚙️</div>

            <div>
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>

            <div>
              <span>Resolved</span>
              <strong>{resolved}</strong>
            </div>
          </div>

        </div>

        {/* ================= TABLE ================= */}

        <section className="complaints-panel">

          <div className="panel-header">

            <div>
              <h2>Citizen Complaints</h2>
              <p>
                Review and update complaint status.
              </p>
            </div>

            <div className="panel-count">
              {filteredComplaints.length} results
            </div>

          </div>

          {/* Filters */}

          <div className="filters">

            <div className="search-box">
              🔎

              <input
                type="text"
                placeholder="Search Complaint ID, name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="empty-state">
              <div className="loading-spinner"></div>
              <h3>Loading complaints...</h3>
              <p>Connecting to SamadhanSetu backend.</p>
            </div>

          ) : filteredComplaints.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">📭</div>

              <h3>No complaints found</h3>

              <p>
                New citizen complaints will appear here.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Citizen</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredComplaints.map((complaint) => (

                    <tr key={complaint.complaint_id}>

                      <td>
                        <strong className="complaint-id">
                          {complaint.complaint_id}
                        </strong>
                      </td>

                      <td>
                        <div className="citizen-cell">
                          <div className="citizen-avatar">
                            {complaint.full_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {complaint.full_name}
                            </strong>

                            <span>
                              {complaint.mobile}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {complaint.category}
                        </span>
                      </td>

                      <td>
                        <div className="description-cell">
                          {complaint.description}
                        </div>
                      </td>

                      <td>
                        <span className="date-cell">
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${complaint.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedComplaint(complaint)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* ================= DETAIL MODAL ================= */}

      {selectedComplaint && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <button
              className="admin-close"
              onClick={() =>
                setSelectedComplaint(null)
              }
            >
              ✕
            </button>

            <div className="detail-heading">

              <span>COMPLAINT DETAILS</span>

              <h2>
                {selectedComplaint.complaint_id}
              </h2>

              <p>
                Submitted on{" "}
                {new Date(
                  selectedComplaint.created_at
                ).toLocaleString()}
              </p>

            </div>

            {/* Citizen */}

            <div className="detail-section">

              <h3>👤 Citizen Information</h3>

              <div className="detail-grid">

                <div>
                  <span>Full Name</span>
                  <strong>
                    {selectedComplaint.full_name}
                  </strong>
                </div>

                <div>
                  <span>Mobile Number</span>
                  <strong>
                    {selectedComplaint.mobile}
                  </strong>
                </div>

              </div>

            </div>

            {/* Complaint */}

            <div className="detail-section">

              <h3>📝 Complaint Information</h3>

              <div className="detail-grid">

                <div>
                  <span>Category</span>
                  <strong>
                    {selectedComplaint.category}
                  </strong>
                </div>

                <div>
                  <span>Current Status</span>

                  <span
                    className={`status-badge status-${selectedComplaint.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {selectedComplaint.status}
                  </span>
                </div>

              </div>

              <div className="full-detail">

                <span>Problem Description</span>

                <p>
                  {selectedComplaint.description}
                </p>

              </div>

            </div>

            {/* Status */}

            <div className="detail-section">

              <h3>⚙️ Update Complaint Status</h3>

              <div className="status-actions">

                {[
                  "Submitted",
                  "Under Review",
                  "In Progress",
                  "Resolved",
                ].map((status) => (

                  <button
                    key={status}
                    disabled={
                      updatingId ===
                      selectedComplaint.complaint_id
                    }
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
                    {status === "Submitted" && "📨"}
                    {status === "Under Review" && "🔍"}
                    {status === "In Progress" && "⚙️"}
                    {status === "Resolved" && "✅"}

                    <span>{status}</span>
                  </button>

                ))}

              </div>

              {updatingId ===
                selectedComplaint.complaint_id && (
                <p className="updating-text">
                  Updating status...
                </p>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;