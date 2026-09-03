import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    category: "",
    description: "",
  });

  const [complaintId, setComplaintId] = useState("");
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const [solutionQuery, setSolutionQuery] = useState("");
  const [solution, setSolution] = useState(null);

  // -----------------------------
  // Navigation
  // -----------------------------

  const goToSection = (section) => {
    setActiveSection(section);

    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  // -----------------------------
  // Form input
  // -----------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Register Complaint
  // -----------------------------

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.mobile ||
      !formData.category ||
      !formData.description
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile: formData.mobile,
          category: formData.category,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.success) {
        setComplaintId(data.complaint.complaint_id);
        setComplaintSubmitted(true);

        setFormData({
          fullName: "",
          mobile: "",
          category: "",
          description: "",
        });
      } else {
        alert("Complaint registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Backend connection failed. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Track Complaint
  // -----------------------------

  const handleTrackComplaint = async () => {
    if (!trackId.trim()) {
      alert("Please enter your Complaint ID.");
      return;
    }

    setIsTracking(true);
    setTrackResult(null);

    try {
      const response = await fetch(
        `${API_URL}/complaints/${trackId.trim().toUpperCase()}`
      );

      const data = await response.json();

      if (data.success) {
        setTrackResult(data.complaint);
      } else {
        alert("Complaint not found.");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Backend connection failed. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setIsTracking(false);
    }
  };

  // -----------------------------
  // Find Solution
  // -----------------------------

  const findSolution = () => {
    const query = solutionQuery.toLowerCase().trim();

    if (!query) {
      alert("Please describe your problem.");
      return;
    }

    if (
      query.includes("scholarship") ||
      query.includes("education") ||
      query.includes("college") ||
      query.includes("student") ||
      query.includes("school")
    ) {
      setSolution({
        title: "Education & Scholarship",
        icon: "🎓",
        text:
          "For education and scholarship related issues, check the relevant government scholarship portal, your college administration and the concerned education department.",
      });
    } else if (
      query.includes("hospital") ||
      query.includes("health") ||
      query.includes("medicine") ||
      query.includes("doctor")
    ) {
      setSolution({
        title: "Healthcare",
        icon: "🏥",
        text:
          "For healthcare issues, contact the nearest government hospital or the concerned health department. You can also register a complaint through SamadhanSetu.",
      });
    } else if (
      query.includes("road") ||
      query.includes("pothole") ||
      query.includes("streetlight") ||
      query.includes("traffic")
    ) {
      setSolution({
        title: "Road & Transport",
        icon: "🚧",
        text:
          "For road, pothole, streetlight or traffic problems, the complaint should be directed to the concerned municipal or transport department.",
      });
    } else if (
      query.includes("pension") ||
      query.includes("senior citizen")
    ) {
      setSolution({
        title: "Pension & Senior Citizen",
        icon: "👴",
        text:
          "For pension and senior citizen related problems, contact the concerned social welfare department or register a complaint through SamadhanSetu.",
      });
    } else if (
      query.includes("ration") ||
      query.includes("food") ||
      query.includes("public distribution")
    ) {
      setSolution({
        title: "Ration & Food Supply",
        icon: "🍚",
        text:
          "For ration and food supply issues, contact the Food & Civil Supplies department or register your complaint through SamadhanSetu.",
      });
    } else {
      setSolution({
        title: "General Civic Issue",
        icon: "🏛️",
        text:
          "Your problem may need to be handled by a local government department. Register a complaint on SamadhanSetu and the issue can be routed to the appropriate department.",
      });
    }
  };

  // -----------------------------
  // Close complaint form
  // -----------------------------

  const closeComplaintForm = () => {
    setShowComplaintForm(false);
    setComplaintSubmitted(false);
    setComplaintId("");
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo" onClick={() => goToSection("home")}>
          <span>🇮🇳</span>
          <strong>SamadhanSetu</strong>
        </div>

        <div className="nav-links">
          <button onClick={() => goToSection("home")}>Home</button>
          <button onClick={() => goToSection("services")}>Services</button>
          <button onClick={() => goToSection("solution")}>Solutions</button>
          <button onClick={() => goToSection("track")}>Track</button>

          <button
            className="login-btn"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section id="home" className="hero">
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
            SamadhanSetu helps citizens find government services,
            submit complaints and track solutions quickly from one platform.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => goToSection("solution")}
            >
              🔎 Find a Solution
            </button>

            <button
              className="secondary-btn"
              onClick={() => setShowComplaintForm(true)}
            >
              📝 Register Complaint
            </button>

          </div>

          <div className="hero-stats">
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

          <div className="card-icon">🏛️</div>

          <h3>One Platform</h3>

          <p>
            Discover services, register complaints and track
            government responses in one place.
          </p>

          <div className="floating-card">
            <span>✓</span>
            Complaint Tracking
          </div>

        </div>
      </section>

      {/* ================= SOLUTION ================= */}

      <section id="solution" className="section solution-section">

        <div className="section-heading">
          <span>SMART ASSISTANCE</span>
          <h2>Find Your Solution 🔎</h2>
          <p>
            Tell us about your problem and SamadhanSetu will suggest
            the relevant government service or department.
          </p>
        </div>

        <div className="solution-box">

          <textarea
            placeholder="Example: I have a scholarship problem..."
            value={solutionQuery}
            onChange={(e) => setSolutionQuery(e.target.value)}
          />

          <button className="primary-btn" onClick={findSolution}>
            Find Solution
          </button>

          {solution && (
            <div className="solution-result">

              <div className="solution-icon">
                {solution.icon}
              </div>

              <div>
                <h3>{solution.title}</h3>
                <p>{solution.text}</p>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ================= SERVICES ================= */}

      <section id="services" className="section">

        <div className="section-heading">
          <span>OUR SERVICES</span>
          <h2>Everything in One Place</h2>
          <p>
            SamadhanSetu simplifies citizen-government interaction.
          </p>
        </div>

        <div className="service-grid">

          <div className="service-card">
            <div className="service-icon">🔎</div>
            <h3>Find Solutions</h3>
            <p>
              Find the right government department and solution
              for your problem.
            </p>
            <button onClick={() => goToSection("solution")}>
              Explore →
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>Register Complaint</h3>
            <p>
              Submit your civic or government related complaint
              and receive a unique Complaint ID.
            </p>
            <button onClick={() => setShowComplaintForm(true)}>
              Register →
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">📍</div>
            <h3>Track Complaint</h3>
            <p>
              Track your complaint status using your unique
              Complaint ID.
            </p>
            <button onClick={() => goToSection("track")}>
              Track →
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>
              Get smart guidance about government services
              and complaint registration.
            </p>
            <button onClick={() => goToSection("solution")}>
              Ask AI →
            </button>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="section how-section">

        <div className="section-heading">
          <span>SIMPLE PROCESS</span>
          <h2>How SamadhanSetu Works</h2>
        </div>

        <div className="steps">

          <div className="step">
            <div>1</div>
            <h3>Describe</h3>
            <p>Tell us about your problem.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div>2</div>
            <h3>Register</h3>
            <p>Submit your complaint online.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div>3</div>
            <h3>Track</h3>
            <p>Track your complaint status.</p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div>4</div>
            <h3>Resolve</h3>
            <p>Get the appropriate solution.</p>
          </div>

        </div>
      </section>

      {/* ================= TRACK ================= */}

      <section id="track" className="section track-section">

        <div className="section-heading">
          <span>COMPLAINT STATUS</span>
          <h2>Track Your Complaint 📍</h2>
          <p>
            Enter your Complaint ID to check the latest status.
          </p>
        </div>

        <div className="track-box">

          <input
            type="text"
            placeholder="Example: SS-123456"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTrackComplaint();
              }
            }}
          />

          <button
            className="primary-btn"
            onClick={handleTrackComplaint}
            disabled={isTracking}
          >
            {isTracking ? "Checking..." : "Track Complaint"}
          </button>

          {trackResult && (
            <div className="track-result">

              <div className="track-header">
                <div>
                  <small>Complaint ID</small>
                  <h3>{trackResult.complaint_id}</h3>
                </div>

                <span className="status-badge">
                  {trackResult.status}
                </span>
              </div>

              <div className="track-details">

                <div>
                  <span>Name</span>
                  <strong>{trackResult.full_name}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{trackResult.category}</strong>
                </div>

                <div>
                  <span>Submitted</span>
                  <strong>
                    {new Date(
                      trackResult.created_at
                    ).toLocaleString()}
                  </strong>
                </div>

              </div>

              <div className="complaint-description">
                <span>Complaint</span>
                <p>{trackResult.description}</p>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer>
        <div className="footer-main">

          <div>
            <h2>🇮🇳 SamadhanSetu</h2>
            <p>
              Your Problem. Our Solution.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <button onClick={() => goToSection("solution")}>
              Find Solution
            </button>
            <button onClick={() => setShowComplaintForm(true)}>
              Register Complaint
            </button>
            <button onClick={() => goToSection("track")}>
              Track Complaint
            </button>
          </div>

          <div>
            <h4>About</h4>
            <p>Smart Citizen Support Platform</p>
            <p>Built for Digital India 🇮🇳</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 SamadhanSetu. Smart Citizen Support Platform.
        </div>
      </footer>

      {/* ================= COMPLAINT MODAL ================= */}

      {showComplaintForm && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-btn"
              onClick={closeComplaintForm}
            >
              ✕
            </button>

            {!complaintSubmitted ? (

              <>
                <div className="modal-heading">
                  <span>📝</span>
                  <h2>Register Complaint</h2>
                  <p>
                    Submit your problem and receive a unique Complaint ID.
                  </p>
                </div>

                <form onSubmit={handleComplaintSubmit}>

                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength="10"
                  />

                  <label>Complaint Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select category
                    </option>
                    <option value="Government Scheme">
                      Government Scheme
                    </option>
                    <option value="Education">
                      Education
                    </option>
                    <option value="Healthcare">
                      Healthcare
                    </option>
                    <option value="Transport">
                      Transport
                    </option>
                    <option value="Road & Infrastructure">
                      Road & Infrastructure
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <label>Describe Your Problem</label>
                  <textarea
                    name="description"
                    placeholder="Explain your problem..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>

                  <button
                    type="submit"
                    className="primary-btn full-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Complaint 🚀"}
                  </button>

                </form>
              </>

            ) : (

              <div className="success-box">

                <div className="success-icon">✓</div>

                <h2>Complaint Registered!</h2>

                <p>
                  Your complaint has been successfully submitted
                  to SamadhanSetu backend.
                </p>

                <div className="complaint-id-box">
                  <span>Your Complaint ID</span>
                  <strong>{complaintId}</strong>
                </div>

                <p className="important">
                  ⚠️ Save this Complaint ID to track your complaint.
                </p>

                <button
                  className="primary-btn full-btn"
                  onClick={() => {
                    closeComplaintForm();
                    setTrackId(complaintId);
                    goToSection("track");
                  }}
                >
                  Track This Complaint →
                </button>

              </div>

            )}

          </div>
        </div>
      )}

      {/* ================= LOGIN MODAL ================= */}

      {showLogin && (
        <div className="modal-overlay">

          <div className="login-modal">

            <button
              className="close-btn"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <div className="login-icon">👤</div>

            <h2>SamadhanSetu Login</h2>

            <p>
              Citizen and department login will be connected
              with the authentication system in the next phase.
            </p>

            <input
              type="text"
              placeholder="Mobile / Email"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <button
              className="primary-btn full-btn"
              onClick={() =>
                alert("Demo Login — Authentication coming soon!")
              }
            >
              Login
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;