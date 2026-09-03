import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

const API_URL = "https://samadhan-setu-vu3l.onrender.com";

function App() {
  // Admin Dashboard
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);

  const [complaint, setComplaint] = useState({
    full_name: "",
    mobile: "",
    category: "",
    description: "",
  });

  const [complaintId, setComplaintId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [solutionText, setSolutionText] = useState("");
  const [solutionCategory, setSolutionCategory] = useState("");

  const registerComplaint = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaint),
      });

      const data = await response.json();

      if (data.success) {
        setComplaintId(data.complaint.complaint_id);
        setMessage("Complaint registered successfully!");
        setComplaint({
          full_name: "",
          mobile: "",
          category: "",
          description: "",
        });
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const trackComplaint = async (e) => {
    e.preventDefault();

    if (!trackId.trim()) {
      setMessage("Please enter Complaint ID.");
      return;
    }

    setLoading(true);
    setTrackedComplaint(null);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/complaints/${trackId.trim().toUpperCase()}`
      );

      const data = await response.json();

      if (data.success) {
        setTrackedComplaint(data.complaint);
      } else {
        setMessage("Complaint not found.");
      }
    } catch (error) {
      setMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const findSolution = () => {
    const text = solutionText.toLowerCase();

    if (!text.trim()) {
      setMessage("Please describe your problem.");
      return;
    }

    if (
      text.includes("water") ||
      text.includes("pani") ||
      text.includes("pipeline")
    ) {
      setSolutionCategory("Water Supply Department");
    } else if (
      text.includes("road") ||
      text.includes("pothole") ||
      text.includes("rasta")
    ) {
      setSolutionCategory("Public Works / Municipal Department");
    } else if (
      text.includes("electric") ||
      text.includes("light") ||
      text.includes("street light")
    ) {
      setSolutionCategory("Electricity Department");
    } else if (
      text.includes("garbage") ||
      text.includes("waste") ||
      text.includes("kachra")
    ) {
      setSolutionCategory("Sanitation Department");
    } else if (
      text.includes("certificate") ||
      text.includes("document")
    ) {
      setSolutionCategory("Citizen Services Department");
    } else {
      setSolutionCategory("Relevant Government Department");
    }
  };

  const goTo = (target) => {
    setPage(target);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => goTo("home")}>
          SamadhanSetu
        </div>

        <div className="nav-links">
          <button onClick={() => goTo("home")}>Home</button>
          <button onClick={() => goTo("services")}>Services</button>
          <button onClick={() => goTo("solution")}>Solutions</button>
          <button onClick={() => goTo("track")}>Track</button>

          <button
            className="login-btn"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">

              <div className="badge">
                🇮🇳 Digital Citizen Support Platform
              </div>

              <h1>
                Your Problem.
                <br />
                <span>Our Solution.</span>
              </h1>

              <p>
                SamadhanSetu helps citizens find government
                services, submit complaints and track solutions
                quickly from one platform.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={() => goTo("solution")}
                >
                  🔎 Find a Solution
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => goTo("complaint")}
                >
                  📝 Register Complaint
                </button>
              </div>

              <div className="stats">
                <div>
                  <strong>24/7</strong>
                  <span>Citizen Support</span>
                </div>

                <div>
                  <strong>1</strong>
                  <span>Unified Platform</span>
                </div>

                <div>
                  <strong>Fast</strong>
                  <span>Complaint Tracking</span>
                </div>
              </div>

            </div>

            <div className="hero-card">
              <div className="hero-icon">🏛️</div>
              <h3>One Platform</h3>
              <p>
                Discover services, register complaints
                and track government responses.
              </p>
              <div className="floating-card">
                Complaint Tracking
              </div>
            </div>
          </section>

          <section className="how-section">
            <h2>How SamadhanSetu Works</h2>

            <div className="how-grid">
              <div className="how-card">
                <div>🔎</div>
                <h3>1. Find Solution</h3>
                <p>
                  Describe your problem and discover the
                  relevant government department.
                </p>
              </div>

              <div className="how-card">
                <div>📝</div>
                <h3>2. Register Complaint</h3>
                <p>
                  Submit your complaint and receive a unique
                  Complaint ID.
                </p>
              </div>

              <div className="how-card">
                <div>📍</div>
                <h3>3. Track Status</h3>
                <p>
                  Track your complaint status anytime.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SOLUTION */}
      {page === "solution" && (
        <section className="page-section">
          <h2>🔎 Find Your Solution</h2>

          <p>
            Describe your civic or government-related problem.
          </p>

          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Example: There is a large pothole near my house..."
          />

          <button
            className="primary-btn"
            onClick={findSolution}
          >
            Find Solution
          </button>

          {solutionCategory && (
            <div className="solution-result">
              <h3>Recommended Department</h3>
              <p>{solutionCategory}</p>

              <button
                className="secondary-btn"
                onClick={() => goTo("complaint")}
              >
                Register Complaint
              </button>
            </div>
          )}

          {message && (
            <p className="message">{message}</p>
          )}
        </section>
      )}

      {/* COMPLAINT */}
      {page === "complaint" && (
        <section className="page-section">
          <h2>📝 Register Complaint</h2>

          <form
            className="complaint-form"
            onSubmit={registerComplaint}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={complaint.full_name}
              required
              onChange={(e) =>
                setComplaint({
                  ...complaint,
                  full_name: e.target.value,
                })
              }
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={complaint.mobile}
              required
              onChange={(e) =>
                setComplaint({
                  ...complaint,
                  mobile: e.target.value,
                })
              }
            />

            <select
              value={complaint.category}
              required
              onChange={(e) =>
                setComplaint({
                  ...complaint,
                  category: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Roads">Roads</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Government Services">
                Government Services
              </option>
              <option value="Other">Other</option>
            </select>

            <textarea
              placeholder="Describe your complaint"
              value={complaint.description}
              required
              onChange={(e) =>
                setComplaint({
                  ...complaint,
                  description: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>
          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {complaintId && (
            <div className="complaint-success">
              <h3>🎉 Complaint Registered!</h3>

              <p>Your Complaint ID is:</p>

              <strong>{complaintId}</strong>

              <p>
                Please save this ID to track your complaint.
              </p>

              <button
                className="secondary-btn"
                onClick={() => {
                  setTrackId(complaintId);
                  goTo("track");
                }}
              >
                Track Complaint
              </button>
            </div>
          )}
        </section>
      )}

      {/* TRACK */}
      {page === "track" && (
        <section className="page-section">
          <h2>📍 Track Complaint</h2>

          <form onSubmit={trackComplaint}>
            <input
              type="text"
              placeholder="Enter Complaint ID e.g. SS-123456"
              value={trackId}
              onChange={(e) =>
                setTrackId(e.target.value)
              }
            />

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Track Complaint"}
            </button>
          </form>

          {message && (
            <p className="message">{message}</p>
          )}

          {trackedComplaint && (
            <div className="track-result">
              <h3>Complaint Details</h3>

              <p>
                <strong>Complaint ID:</strong>{" "}
                {trackedComplaint.complaint_id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {trackedComplaint.full_name}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {trackedComplaint.category}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {trackedComplaint.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status-badge">
                  {trackedComplaint.status}
                </span>
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(
                  trackedComplaint.created_at
                ).toLocaleString()}
              </p>
            </div>
          )}
        </section>
      )}

      {/* SERVICES */}
      {page === "services" && (
        <section className="page-section">
          <h2>🏛️ Government Services</h2>

          <div className="services-grid">
            <div className="service-card">
              <h3>💧 Water Supply</h3>
              <p>Water supply related complaints and issues.</p>
            </div>

            <div className="service-card">
              <h3>🛣️ Roads</h3>
              <p>Report potholes and damaged roads.</p>
            </div>

            <div className="service-card">
              <h3>💡 Electricity</h3>
              <p>Report street light and electricity issues.</p>
            </div>

            <div className="service-card">
              <h3>🗑️ Sanitation</h3>
              <p>Garbage and waste management complaints.</p>
            </div>

            <div className="service-card">
              <h3>📄 Citizen Services</h3>
              <p>Government certificates and documents.</p>
            </div>

            <div className="service-card">
              <h3>🏛️ Other Services</h3>
              <p>Other civic and government problems.</p>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <h3>SamadhanSetu</h3>
        <p>
          Your Problem. Our Solution.
        </p>
        <p>
          Smart Citizen Grievance Redressal Platform
        </p>
        <p>© 2026 SamadhanSetu</p>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <h2>🔐 Login</h2>

            <input
              type="text"
              placeholder="Username"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <button
              className="primary-btn"
              onClick={() => {
                setShowLogin(false);
                window.location.href = "/admin";
              }}
            >
              Login
            </button>

            <p>
              Demo Admin Login
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;