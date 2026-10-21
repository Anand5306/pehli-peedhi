/**
 * PehliPeedhi (पहली पीढ़ी) - Main Application Controller
 * Handles client-side navigation, state management, form submissions,
 * interactive demo data updates, and reusable component rendering.
 */

// Global Application State (Persisted in localStorage for demo interactivity)
const STORAGE_KEY = "pehlipedhi_state_v2";

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved state, resetting:", e);
    }
  }

  return {
    currentRole: "student", // 'student' | 'mentor' | 'guest'
    authTab: "login", // 'login' | 'signup'
    studentProfile: { ...INITIAL_STUDENT_PROFILE },
    mentorProfile: { ...INITIAL_MENTOR_PROFILE },
    mentors: [...SAMPLE_MENTORS],
    sentRequests: [...SAMPLE_SENT_REQUESTS],
    incomingRequests: [...SAMPLE_INCOMING_REQUESTS],
    selectedMentorId: "mentor-1",
    filters: {
      search: "",
      field: "",
      state: "",
      district: ""
    }
  };
}

let AppState = getInitialState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
}

// Router and Navigation Controller
function getRouteFromHash() {
  const hash = window.location.hash.replace("#", "").trim();
  if (!hash) return "landing";
  
  // Handle routes with parameters like mentor-detail/mentor-1
  if (hash.startsWith("mentor-detail/")) {
    const id = hash.split("/")[1];
    if (id) {
      AppState.selectedMentorId = id;
    }
    return "mentor-detail";
  }
  
  return hash;
}

function navigateTo(route, param = null) {
  if (param) {
    window.location.hash = `${route}/${param}`;
  } else {
    window.location.hash = route;
  }
}

// Role Switching Helper (for demo inspection)
function setRole(newRole) {
  AppState.currentRole = newRole;
  saveState();
  updateHeaderUI();
  
  // Re-render current page or contextual dashboard/profile
  const currentView = getRouteFromHash();
  if (currentView === "dashboard" || currentView === "profile" || currentView === "landing" || currentView === "find-mentors") {
    renderCurrentView();
  } else {
    updateHeaderUI();
  }
}

function updateHeaderUI() {
  // Update role buttons in demo banner
  const btnGuest = document.getElementById("roleBtnGuest");
  const btnStudent = document.getElementById("roleBtnStudent");
  const btnMentor = document.getElementById("roleBtnMentor");
  const userPill = document.getElementById("userPill");
  const userPillLabel = document.getElementById("userPillLabel");
  const authBtn = document.getElementById("authBtn");
  const mainNav = document.getElementById("mainNav");

  if (btnGuest) btnGuest.classList.toggle("active", AppState.currentRole === "guest");
  if (btnStudent) btnStudent.classList.toggle("active", AppState.currentRole === "student");
  if (btnMentor) btnMentor.classList.toggle("active", AppState.currentRole === "mentor");

  if (AppState.currentRole === "guest") {
    if (userPillLabel) userPillLabel.textContent = "Guest Visitor";
    if (authBtn) authBtn.textContent = "Log In / Sign Up";
  } else if (AppState.currentRole === "student") {
    if (userPillLabel) userPillLabel.textContent = `Student: ${AppState.studentProfile.fullName}`;
    if (authBtn) authBtn.textContent = "Switch to Mentor View";
  } else if (AppState.currentRole === "mentor") {
    if (userPillLabel) userPillLabel.textContent = `Graduate Mentor: ${AppState.mentorProfile.fullName}`;
    if (authBtn) authBtn.textContent = "Switch to Student View";
  }

  // DYNAMIC ROLE-BASED NAVIGATION
  // Mentors see Mentor Dashboard, Student Requests, Profile (NOT Find Mentors)
  // Students see Find Mentors, My Requests, Profile
  const activeHash = getRouteFromHash();
  const pendingRequestsCount = AppState.incomingRequests.filter(r => r.status === "Pending").length;

  if (mainNav) {
    if (AppState.currentRole === "mentor") {
      mainNav.innerHTML = `
        <a href="#landing" class="nav-link ${activeHash === 'landing' ? 'active' : ''}">Home</a>
        <a href="#mentor-dashboard" class="nav-link ${activeHash === 'mentor-dashboard' || activeHash === 'dashboard' ? 'active' : ''}">
          Mentor Dashboard
        </a>
        <a href="#mentor-dashboard" class="nav-link" onclick="scrollToRequests(event)">
          Student Requests ${pendingRequestsCount > 0 ? `<span class="nav-badge">${pendingRequestsCount}</span>` : ''}
        </a>
        <a href="#mentor-profile" class="nav-link ${activeHash === 'mentor-profile' || activeHash === 'profile' ? 'active' : ''}">
          My Mentor Profile
        </a>
      `;
    } else if (AppState.currentRole === "student") {
      mainNav.innerHTML = `
        <a href="#landing" class="nav-link ${activeHash === 'landing' ? 'active' : ''}">Home</a>
        <a href="#find-mentors" class="nav-link ${activeHash === 'find-mentors' ? 'active' : ''}">Find Mentors</a>
        <a href="#student-dashboard" class="nav-link ${activeHash === 'student-dashboard' || activeHash === 'dashboard' ? 'active' : ''}">
          My Dashboard &amp; Requests
        </a>
        <a href="#student-profile" class="nav-link ${activeHash === 'student-profile' || activeHash === 'profile' ? 'active' : ''}">
          My Profile
        </a>
      `;
    } else {
      mainNav.innerHTML = `
        <a href="#landing" class="nav-link ${activeHash === 'landing' ? 'active' : ''}">Home</a>
        <a href="#find-mentors" class="nav-link ${activeHash === 'find-mentors' ? 'active' : ''}">Find Mentors</a>
        <a href="#login" class="nav-link ${activeHash === 'login' ? 'active' : ''}">Log In</a>
        <a href="#signup" class="nav-link ${activeHash === 'signup' ? 'active' : ''}">Sign Up</a>
      `;
    }
  }
}

function scrollToRequests(e) {
  if (e) e.preventDefault();
  navigateTo("mentor-dashboard");
  setTimeout(() => {
    const el = document.getElementById("incomingRequestsSection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 100);
}

function toggleAuthNav() {
  if (AppState.currentRole === "guest") {
    navigateTo("login");
  } else if (AppState.currentRole === "student") {
    setRole("mentor");
    navigateTo("mentor-dashboard");
  } else {
    setRole("student");
    navigateTo("student-dashboard");
  }
}

// ==========================================================================
// VIEW RENDERERS
// ==========================================================================

function renderCurrentView() {
  const main = document.getElementById("app-main");
  const route = getRouteFromHash();

  updateHeaderUI();

  // Close mobile nav if open
  const mainNav = document.getElementById("mainNav");
  if (mainNav) mainNav.classList.remove("mobile-open");

  window.scrollTo({ top: 0, behavior: "instant" });

  switch (route) {
    case "landing":
      main.innerHTML = renderLandingPage();
      break;
    case "login":
      main.innerHTML = renderAuthPage("login");
      initAuthFormHandlers("login");
      break;
    case "signup":
      main.innerHTML = renderAuthPage("signup");
      initAuthFormHandlers("signup");
      break;
    case "student-profile":
      main.innerHTML = renderStudentProfileForm();
      initStudentProfileHandler();
      break;
    case "mentor-profile":
      main.innerHTML = renderMentorProfileForm();
      initMentorProfileHandler();
      break;
    case "profile":
      // Contextual: route to current role's profile form
      if (AppState.currentRole === "mentor") {
        main.innerHTML = renderMentorProfileForm();
        initMentorProfileHandler();
      } else {
        main.innerHTML = renderStudentProfileForm();
        initStudentProfileHandler();
      }
      break;
    case "find-mentors":
      main.innerHTML = renderFindMentorsPage();
      initFilterHandlers();
      break;
    case "mentor-detail":
      main.innerHTML = renderMentorDetailPage(AppState.selectedMentorId);
      break;
    case "student-dashboard":
      main.innerHTML = renderStudentDashboard();
      break;
    case "mentor-dashboard":
      main.innerHTML = renderMentorDashboard();
      break;
    case "dashboard":
      // Contextual: route to current role's dashboard
      if (AppState.currentRole === "mentor") {
        main.innerHTML = renderMentorDashboard();
      } else {
        main.innerHTML = renderStudentDashboard();
      }
      break;
    default:
      main.innerHTML = renderLandingPage();
      break;
  }
}

// --------------------------------------------------------------------------
// 1. LANDING PAGE (Contextual for Student vs Mentor)
// --------------------------------------------------------------------------
function renderLandingPage() {
  const isMentor = AppState.currentRole === "mentor";
  const isStudent = AppState.currentRole === "student";
  const pendingRequestsCount = AppState.incomingRequests.filter(r => r.status === "Pending").length;
  const previewMentors = AppState.mentors.slice(0, 3);

  return `
    <div class="page-view landing-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div>
            <div class="hero-tagline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${isMentor ? "Graduate Mentor Workspace &bull; Alumni Giving Back" : "Empowering India's First-Generation Learners"}</span>
            </div>

            ${isMentor ? `
              <h1 class="hero-title">
                Give back to first-gen learners <span class="highlight">walking your path.</span>
              </h1>
              <p class="hero-description">
                Welcome back, Mentor! Your firsthand experience navigating higher education without family precedent can change a student's life. Review questions, accept mentorship requests, and share guidance in regional languages.
              </p>
              <div class="hero-actions">
                <a href="#mentor-dashboard" class="btn btn-primary btn-lg">
                  Go to Mentor Dashboard &rarr;
                </a>
                <a href="#mentor-dashboard" class="btn btn-accent btn-lg" onclick="scrollToRequests(event)">
                  Review Student Requests ${pendingRequestsCount > 0 ? `(${pendingRequestsCount} Pending)` : ''}
                </a>
                <a href="#mentor-profile" class="btn btn-secondary btn-lg">
                  Edit Mentor Profile
                </a>
              </div>
            ` : `
              <h1 class="hero-title">
                The first in your family to attend college? <span class="highlight">You are not alone.</span>
              </h1>
              <p class="hero-description">
                PehliPeedhi connects students from non-graduate families with verified graduates who walked the same journey. Get honest, empathetic guidance on degree options, government scholarships, entrance tests, and career transitions.
              </p>
              <div class="hero-actions">
                <a href="${isStudent ? '#find-mentors' : '#signup'}" class="btn btn-primary btn-lg">
                  ${isStudent ? 'Find Graduate Mentors &rarr;' : 'Get Started &mdash; It\'s Free'}
                </a>
                ${isStudent ? `
                  <a href="#student-dashboard" class="btn btn-secondary btn-lg">
                    My Student Dashboard
                  </a>
                ` : `
                  <a href="#login" class="btn btn-secondary btn-lg">
                    Log In
                  </a>
                  <a href="#find-mentors" class="btn btn-outline-primary btn-lg">
                    Browse Mentors
                  </a>
                `}
              </div>
            `}

            <div class="hero-trust-bullets">
              <div class="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Guidance in Regional Languages</span>
              </div>
              <div class="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>100% Free Community Mentorship</span>
              </div>
              <div class="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Verified First-Gen Alumni</span>
              </div>
            </div>
          </div>

          <!-- Hero Highlight Card -->
          <div class="hero-card-preview">
            <div class="hero-card-header">
              <span class="badge-role">${isMentor ? "Mentor Contribution" : "First-Gen Student Reality"}</span>
              <span class="badge-demo">Mission Focus</span>
            </div>
            <div class="hero-quote">
              "When I took admission in B.Tech, neither my parents nor anyone in our village knew the difference between branches, hostel rules, or semester fees. Having one mentor from my district would have saved me two years of uncertainty."
            </div>
            <div class="hero-mini-stats">
              <div class="mini-stat-box">
                <div class="mini-stat-num">14+</div>
                <div class="mini-stat-label">Indian Regional Languages</div>
              </div>
              <div class="mini-stat-box">
                <div class="mini-stat-num">30+</div>
                <div class="mini-stat-label">Districts &amp; States Represented</div>
              </div>
              <div class="mini-stat-box">
                <div class="mini-stat-num">Free</div>
                <div class="mini-stat-label">No Coaching Fees or Paywalls</div>
              </div>
              <div class="mini-stat-box">
                <div class="mini-stat-num">Direct</div>
                <div class="mini-stat-label">Student to Graduate Advice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Three Pillars of PehliPeedhi -->
      <section class="pillars-section">
        <div class="container">
          <div class="section-head">
            <span class="section-subtitle">Why PehliPeedhi Exists</span>
            <h2 class="section-title">Designed specifically for first-in-family achievers</h2>
            <p class="section-desc">Conventional career counseling assumes educated parents and high budgets. We build mentorship around the realities of first-generation learners.</p>
          </div>

          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 class="pillar-title">Comfort in Your Own Tongue</h3>
              <p class="pillar-text">
                Speak directly in Hindi, Tamil, Marathi, Bengali, Telugu, Bhojpuri and more. No need to feel conscious about English proficiency when asking critical life questions.
              </p>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              </div>
              <h3 class="pillar-title">Real Guidance, Zero Jargon</h3>
              <p class="pillar-text">
                Mentors explain complex choices: government college fees vs private colleges, state scholarship documentation, hostel living, and entrance exam preparation on a tight family budget.
              </p>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 class="pillar-title">Mentors Who Stood Where You Stand</h3>
              <p class="pillar-text">
                Every mentor on this platform was the first in their own household to graduate. They understand the hesitation, family expectations, and financial pressures deeply.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Sample Mentors Preview Section -->
      <section class="landing-preview-section">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="section-subtitle">${isMentor ? "Peer Mentors Directory" : "Sample Mentor Directory"}</span>
              <h2 class="section-title" style="margin-bottom: 0.25rem;">
                ${isMentor ? "Meet Your Fellow Graduate Mentors" : "Meet Graduate Mentors From Across India"}
              </h2>
              <p class="section-desc">Sample profiles previewing our mentor community cards.</p>
            </div>
            ${isMentor ? `
              <a href="#mentor-dashboard" class="btn btn-primary" onclick="scrollToRequests(event)">
                Go to Incoming Requests &rarr;
              </a>
            ` : `
              <a href="#find-mentors" class="btn btn-primary">
                View All Mentors (${AppState.mentors.length}) &rarr;
              </a>
            `}
          </div>

          <div class="mentor-cards-grid">
            ${previewMentors.map(renderMentorCardSnippet).join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. AUTHENTICATION PAGES (Login & Sign Up)
// --------------------------------------------------------------------------
function renderAuthPage(mode) {
  const isLogin = mode === "login";

  return `
    <div class="auth-page-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">${isLogin ? "Welcome Back to PehliPeedhi" : "Join PehliPeedhi"}</h1>
          <p class="auth-subtitle">
            ${isLogin ? "Sign in to access your dashboard and mentorship connections" : "Create an account to start giving or receiving first-generation mentorship"}
          </p>
        </div>

        <!-- Auth Tabs: Sign Up vs Login -->
        <div class="auth-tabs">
          <button type="button" class="auth-tab-btn ${!isLogin ? "active" : ""}" onclick="navigateTo('signup')">
            Sign Up
          </button>
          <button type="button" class="auth-tab-btn ${isLogin ? "active" : ""}" onclick="navigateTo('login')">
            Log In
          </button>
        </div>

        <form id="authForm">
          <!-- Role Selector: Student vs Graduate Mentor -->
          <div class="form-group">
            <span class="role-select-label">Choose your role:</span>
            <div class="role-cards-grid">
              <label class="role-card-radio">
                <input type="radio" name="authRole" value="student" checked>
                <div class="role-card-inner">
                  <div class="role-card-title">Student</div>
                  <div class="role-card-desc">Seeking guidance for college or career</div>
                </div>
              </label>

              <label class="role-card-radio">
                <input type="radio" name="authRole" value="mentor">
                <div class="role-card-inner">
                  <div class="role-card-title">Graduate Mentor</div>
                  <div class="role-card-desc">First-gen graduate giving back</div>
                </div>
              </label>
            </div>
          </div>

          ${!isLogin ? `
            <div class="form-group">
              <label class="form-label" for="authFullName">Full Name <span class="required">*</span></label>
              <input type="text" class="form-input" id="authFullName" placeholder="e.g. Aman Kumar" required value="Aman Kumar">
            </div>
          ` : ""}

          <div class="form-group">
            <label class="form-label" for="authEmail">Email Address <span class="required">*</span></label>
            <input type="email" class="form-input" id="authEmail" placeholder="e.g. name@example.com" required value="aman.student@pehlipedhi.demo">
          </div>

          <div class="form-group">
            <label class="form-label" for="authPassword">Password <span class="required">*</span></label>
            <input type="password" class="form-input" id="authPassword" placeholder="Enter your password" required value="demo-password">
            ${isLogin ? `
              <div style="text-align: right; margin-top: 0.35rem;">
                <span style="font-size: 0.75rem; color: var(--text-muted); cursor: default;">Demo password prefilled</span>
              </div>
            ` : ""}
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1.5rem;">
            ${isLogin ? "Log In to Account" : "Create Account & Continue"}
          </button>

          <div class="form-disclaimer">
            <span class="badge-demo">Demo Mode</span> &bull; Simulated authentication session. Selecting your role configures your active profile and dashboard.
          </div>
        </form>
      </div>
    </div>
  `;
}

function initAuthFormHandlers(mode) {
  const form = document.getElementById("authForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedRole = document.querySelector('input[name="authRole"]:checked')?.value || "student";
    const emailInput = document.getElementById("authEmail")?.value || "";
    const nameInput = document.getElementById("authFullName")?.value;

    AppState.currentRole = selectedRole;
    if (selectedRole === "student") {
      if (nameInput) AppState.studentProfile.fullName = nameInput;
      if (emailInput) AppState.studentProfile.email = emailInput;
      saveState();
      updateHeaderUI();
      navigateTo(mode === "signup" ? "student-profile" : "student-dashboard");
    } else {
      if (nameInput) AppState.mentorProfile.fullName = nameInput;
      if (emailInput) AppState.mentorProfile.email = emailInput;
      saveState();
      updateHeaderUI();
      navigateTo(mode === "signup" ? "mentor-profile" : "mentor-dashboard");
    }
  });
}

// --------------------------------------------------------------------------
// 3. STUDENT PROFILE FORM
// --------------------------------------------------------------------------
function renderStudentProfileForm() {
  const p = AppState.studentProfile;

  return `
    <div class="profile-page-container">
      <div class="profile-card">
        <div class="profile-header-strip">
          <div class="profile-title-block">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge-role">Student Profile</span>
              <span class="badge-demo">Demo Session</span>
            </div>
            <h1>Student Profile Form</h1>
            <p>Help graduate mentors understand your current stage and educational goals.</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="navigateTo('student-dashboard')">
            View Dashboard &rarr;
          </button>
        </div>

        <div id="studentFeedbackBanner" class="feedback-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span id="studentFeedbackMsg">Profile updated successfully in this demo session.</span>
        </div>

        <form id="studentProfileForm">
          <div class="form-section-title">Personal &amp; Contact Details</div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label" for="stuFullName">Full Name <span class="required">*</span></label>
              <input type="text" class="form-input" id="stuFullName" value="${escapeHtml(p.fullName)}" required placeholder="e.g. Aman Kumar">
            </div>

            <div class="form-group">
              <label class="form-label" for="stuEmail">Email Address <span class="required">*</span></label>
              <input type="email" class="form-input" id="stuEmail" value="${escapeHtml(p.email || 'aman.student@pehlipedhi.demo')}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="stuPhone">Phone / WhatsApp <span class="required">*</span></label>
              <input type="text" class="form-input" id="stuPhone" value="${escapeHtml(p.phone || '+91 98765 43210')}" required placeholder="e.g. +91 98765 43210">
              <span class="form-helper">Shared with mentor once they accept your request.</span>
            </div>
          </div>

          <div class="form-section-title">Location (India)</div>
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label" for="stuCity">City / Town <span class="required">*</span></label>
              <input type="text" class="form-input" id="stuCity" value="${escapeHtml(p.city)}" required placeholder="e.g. Muzaffarpur">
            </div>

            <div class="form-group">
              <label class="form-label" for="stuDistrict">District <span class="required">*</span></label>
              <input type="text" class="form-input" id="stuDistrict" value="${escapeHtml(p.district)}" required placeholder="e.g. Muzaffarpur">
            </div>

            <div class="form-group">
              <label class="form-label" for="stuState">State <span class="required">*</span></label>
              <select class="form-select" id="stuState" required>
                ${INDIAN_STATES.map(st => `<option value="${st}" ${st === p.state ? "selected" : ""}>${st}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-section-title">Education &amp; Mentorship Preferences</div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="stuLevel">Current Education Level <span class="required">*</span></label>
              <select class="form-select" id="stuLevel" required>
                ${EDUCATION_LEVELS.map(lvl => `<option value="${lvl}" ${lvl === p.currentEducationLevel ? "selected" : ""}>${lvl}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="stuLanguage">Preferred Language <span class="required">*</span></label>
              <select class="form-select" id="stuLanguage" required>
                ${LANGUAGES_LIST.map(lang => `<option value="${lang}" ${lang === p.preferredLanguage ? "selected" : ""}>${lang}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="stuIntendedCourse">Intended Course / Career Path <span class="required">*</span></label>
            <input type="text" class="form-input" id="stuIntendedCourse" value="${escapeHtml(p.intendedCourse)}" required placeholder="e.g. B.Tech in Computer Science / IT or UPSC Civil Services preparation">
            <span class="form-helper">What course or career are you hoping to enter or learn more about?</span>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="submit" class="btn btn-primary btn-lg">
              Save Student Profile
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="navigateTo('student-dashboard')">
              Cancel
            </button>
          </div>

          <div class="form-disclaimer">
            &bull; Sample profile preview: Submitting updates this student profile in memory/session for previewing dashboard and requests.
          </div>
        </form>
      </div>
    </div>
  `;
}

function initStudentProfileHandler() {
  const form = document.getElementById("studentProfileForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    AppState.studentProfile.fullName = document.getElementById("stuFullName").value.trim();
    AppState.studentProfile.email = document.getElementById("stuEmail").value.trim();
    AppState.studentProfile.phone = document.getElementById("stuPhone").value.trim();
    AppState.studentProfile.city = document.getElementById("stuCity").value.trim();
    AppState.studentProfile.district = document.getElementById("stuDistrict").value.trim();
    AppState.studentProfile.state = document.getElementById("stuState").value;
    AppState.studentProfile.currentEducationLevel = document.getElementById("stuLevel").value;
    AppState.studentProfile.preferredLanguage = document.getElementById("stuLanguage").value;
    AppState.studentProfile.intendedCourse = document.getElementById("stuIntendedCourse").value.trim();

    saveState();
    updateHeaderUI();

    const banner = document.getElementById("studentFeedbackBanner");
    if (banner) {
      banner.className = "feedback-banner show success";
      setTimeout(() => {
        banner.className = "feedback-banner";
      }, 3500);
    }
  });
}

// --------------------------------------------------------------------------
// 4. GRADUATE MENTOR PROFILE FORM
// --------------------------------------------------------------------------
function renderMentorProfileForm() {
  const m = AppState.mentorProfile;

  return `
    <div class="profile-page-container">
      <div class="profile-card">
        <div class="profile-header-strip">
          <div class="profile-title-block">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge-role" style="background-color: var(--accent-saffron-light); color: var(--accent-saffron);">Graduate Mentor Profile</span>
              <span class="badge-demo">Demo Session</span>
            </div>
            <h1>Graduate Mentor Profile Form</h1>
            <p>Share your education background to mentor first-generation students.</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="navigateTo('mentor-dashboard')">
            View Dashboard &rarr;
          </button>
        </div>

        <div id="mentorFeedbackBanner" class="feedback-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span id="mentorFeedbackMsg">Mentor profile updated successfully in this demo session.</span>
        </div>

        <form id="mentorProfileForm">
          <div class="form-section-title">Mentor Identity &amp; Contact</div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label" for="menFullName">Full Name <span class="required">*</span></label>
              <input type="text" class="form-input" id="menFullName" value="${escapeHtml(m.fullName)}" required placeholder="e.g. Priya Sharma">
            </div>

            <div class="form-group">
              <label class="form-label" for="menEmail">Email Address <span class="required">*</span></label>
              <input type="email" class="form-input" id="menEmail" value="${escapeHtml(m.email || 'priya.mentor@pehlipedhi.demo')}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="menPhone">Phone / WhatsApp <span class="required">*</span></label>
              <input type="text" class="form-input" id="menPhone" value="${escapeHtml(m.phone || '+91 98111 22334')}" required placeholder="e.g. +91 98111 22334">
            </div>
          </div>

          <div class="form-section-title">Location (India)</div>
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label" for="menCity">City <span class="required">*</span></label>
              <input type="text" class="form-input" id="menCity" value="${escapeHtml(m.city)}" required placeholder="e.g. Patna">
            </div>

            <div class="form-group">
              <label class="form-label" for="menDistrict">District <span class="required">*</span></label>
              <input type="text" class="form-input" id="menDistrict" value="${escapeHtml(m.district)}" required placeholder="e.g. Patna">
            </div>

            <div class="form-group">
              <label class="form-label" for="menState">State <span class="required">*</span></label>
              <select class="form-select" id="menState" required>
                ${INDIAN_STATES.map(st => `<option value="${st}" ${st === m.state ? "selected" : ""}>${st}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-section-title">Education &amp; Expertise</div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="menCollege">Graduation College / University <span class="required">*</span></label>
              <input type="text" class="form-input" id="menCollege" value="${escapeHtml(m.graduationCollege)}" required placeholder="e.g. National Institute of Technology (NIT) Trichy">
            </div>

            <div class="form-group">
              <label class="form-label" for="menDegree">Degree Obtained <span class="required">*</span></label>
              <input type="text" class="form-input" id="menDegree" value="${escapeHtml(m.degree)}" required placeholder="e.g. B.Tech in Computer Science">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="menField">Field / Broad Discipline <span class="required">*</span></label>
              <select class="form-select" id="menField" required>
                ${FIELDS_OF_STUDY.map(f => `<option value="${f}" ${f === m.field ? "selected" : ""}>${f}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="menGradYear">Graduation Year <span class="required">*</span></label>
              <input type="number" class="form-input" id="menGradYear" min="1980" max="2026" value="${m.graduationYear || 2021}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="menExpertise">Field &amp; Expertise Areas <span class="required">*</span></label>
            <input type="text" class="form-input" id="menExpertise" value="${escapeHtml(m.expertise)}" required placeholder="e.g. JEE Preparation, Engineering Branch Selection, Software Careers">
            <span class="form-helper">List key topics you can advise first-generation students on.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="menLanguages">Languages You Can Mentor In <span class="required">*</span></label>
            <input type="text" class="form-input" id="menLanguages" value="${escapeHtml(m.languages)}" required placeholder="e.g. Hindi, English, Bhojpuri">
            <span class="form-helper">Separate multiple languages with commas.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="menBio">Short Bio (Your First-Generation Story) <span class="required">*</span></label>
            <textarea class="form-textarea" id="menBio" rows="4" required placeholder="Share how you navigated being a first-generation learner and why you want to support students.">${escapeHtml(m.shortBio)}</textarea>
            <span class="form-helper">This helps students relate to you and feel comfortable reaching out.</span>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="submit" class="btn btn-primary btn-lg">
              Save Graduate Mentor Profile
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="navigateTo('mentor-dashboard')">
              Cancel
            </button>
          </div>

          <div class="form-disclaimer">
            &bull; Sample profile preview: Saving updates this mentor profile for the demo session.
          </div>
        </form>
      </div>
    </div>
  `;
}

function initMentorProfileHandler() {
  const form = document.getElementById("mentorProfileForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    AppState.mentorProfile.fullName = document.getElementById("menFullName").value.trim();
    AppState.mentorProfile.email = document.getElementById("menEmail").value.trim();
    AppState.mentorProfile.phone = document.getElementById("menPhone").value.trim();
    AppState.mentorProfile.city = document.getElementById("menCity").value.trim();
    AppState.mentorProfile.district = document.getElementById("menDistrict").value.trim();
    AppState.mentorProfile.state = document.getElementById("menState").value;
    AppState.mentorProfile.graduationCollege = document.getElementById("menCollege").value.trim();
    AppState.mentorProfile.degree = document.getElementById("menDegree").value.trim();
    AppState.mentorProfile.field = document.getElementById("menField").value;
    AppState.mentorProfile.graduationYear = document.getElementById("menGradYear").value;
    AppState.mentorProfile.expertise = document.getElementById("menExpertise").value.trim();
    AppState.mentorProfile.languages = document.getElementById("menLanguages").value.trim();
    AppState.mentorProfile.shortBio = document.getElementById("menBio").value.trim();

    saveState();
    updateHeaderUI();

    const banner = document.getElementById("mentorFeedbackBanner");
    if (banner) {
      banner.className = "feedback-banner show success";
      setTimeout(() => {
        banner.className = "feedback-banner";
      }, 3500);
    }
  });
}

// --------------------------------------------------------------------------
// 5. FIND MENTORS PAGE (Smooth Instant Search & Focus Retention)
// --------------------------------------------------------------------------
function renderFindMentorsPage() {
  const isMentor = AppState.currentRole === "mentor";
  const filtered = filterMentorsList();

  return `
    <div class="page-view find-mentors-view">
      <div class="page-header-banner">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge-role">${isMentor ? "Peer Mentors Directory" : "Mentorship Directory"}</span>
                <span class="badge-demo">Demo Data Preview</span>
              </div>
              <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main);">
                ${isMentor ? "Graduate Mentors Community" : "Find Graduate Mentors"}
              </h1>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">
                ${isMentor 
                  ? "Explore your fellow first-generation alumni mentors from across India."
                  : "Search verified first-generation graduates across India by city, district, field of study, and expertise."
                }
              </p>
            </div>
            ${isMentor ? `
              <button type="button" class="btn btn-secondary btn-sm" onclick="setRole('student'); navigateTo('find-mentors');">
                Switch to Student Mode
              </button>
            ` : ""}
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Search & Filter Controls -->
        <div class="filters-card">
          <form id="mentorFiltersForm" onsubmit="event.preventDefault(); applyFilters();">
            <div class="filters-grid">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="filterSearch">Search by Name, College, City or Expertise</label>
                <input type="text" class="form-input" id="filterSearch" placeholder="Type here (e.g. NIT, MBBS, Patna, JEE)..." value="${escapeHtml(AppState.filters.search)}" autocomplete="off">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="filterField">Field of Study</label>
                <select class="form-select" id="filterField">
                  <option value="">All Fields</option>
                  ${FIELDS_OF_STUDY.map(f => `<option value="${f}" ${AppState.filters.field === f ? "selected" : ""}>${f}</option>`).join("")}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="filterState">State / Region</label>
                <select class="form-select" id="filterState">
                  <option value="">All States</option>
                  ${INDIAN_STATES.map(st => `<option value="${st}" ${AppState.filters.state === st ? "selected" : ""}>${st}</option>`).join("")}
                </select>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-primary" onclick="applyFilters()">
                  Filter
                </button>
                <button type="button" class="btn btn-secondary" onclick="resetFilters()">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Separate Container for Results: Typing never re-renders inputs, retaining focus! -->
        <div id="mentorResultsContainer">
          ${renderMentorResultsContent(filtered)}
        </div>
      </div>
    </div>
  `;
}

function renderMentorResultsContent(filtered) {
  return `
    <!-- Filter Count Bar -->
    <div class="filter-results-bar">
      <div>
        Showing <strong>${filtered.length}</strong> of <strong>${AppState.mentors.length}</strong> graduate mentors
        ${(AppState.filters.search || AppState.filters.field || AppState.filters.state) ? '<span style="color: var(--accent-saffron); font-weight: 600;"> (filtered)</span>' : ''}
      </div>
      <div style="font-size: 0.8125rem;">
        <span class="badge-demo">Sample Cards Preview</span>
      </div>
    </div>

    <!-- Mentor Cards Grid -->
    ${filtered.length > 0 ? `
      <div class="mentor-cards-grid">
        ${filtered.map(renderMentorCardSnippet).join("")}
      </div>
    ` : `
      <div class="empty-state-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3>No mentors match your search criteria</h3>
        <p>Try clearing your keyword or state filters to browse all available first-generation mentors.</p>
        <button type="button" class="btn btn-secondary" style="margin-top: 1rem;" onclick="resetFilters()">
          Clear All Filters
        </button>
      </div>
    `}
  `;
}

function filterMentorsList() {
  const { search, field, state } = AppState.filters;
  const q = search.toLowerCase().trim();

  return AppState.mentors.filter(m => {
    if (field && m.field !== field) return false;
    if (state && m.state !== state) return false;

    if (q) {
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchCollege = m.graduationCollege.toLowerCase().includes(q);
      const matchDegree = m.degree.toLowerCase().includes(q);
      const matchExpertise = m.expertise.toLowerCase().includes(q);
      const matchCity = m.city.toLowerCase().includes(q);
      const matchDistrict = m.district.toLowerCase().includes(q);
      const matchLanguages = (Array.isArray(m.languages) ? m.languages.join(" ") : m.languages).toLowerCase().includes(q);

      if (!matchName && !matchCollege && !matchDegree && !matchExpertise && !matchCity && !matchDistrict && !matchLanguages) {
        return false;
      }
    }
    return true;
  });
}

function initFilterHandlers() {
  const searchInput = document.getElementById("filterSearch");
  const fieldSelect = document.getElementById("filterField");
  const stateSelect = document.getElementById("filterState");

  // SMOOTH LIVE SEARCH: Updates only the results container, preserves input focus!
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.filters.search = e.target.value;
      const container = document.getElementById("mentorResultsContainer");
      if (container) {
        const filtered = filterMentorsList();
        container.innerHTML = renderMentorResultsContent(filtered);
      }
    });
  }

  if (fieldSelect) {
    fieldSelect.addEventListener("change", (e) => {
      AppState.filters.field = e.target.value;
      const container = document.getElementById("mentorResultsContainer");
      if (container) {
        const filtered = filterMentorsList();
        container.innerHTML = renderMentorResultsContent(filtered);
      }
    });
  }

  if (stateSelect) {
    stateSelect.addEventListener("change", (e) => {
      AppState.filters.state = e.target.value;
      const container = document.getElementById("mentorResultsContainer");
      if (container) {
        const filtered = filterMentorsList();
        container.innerHTML = renderMentorResultsContent(filtered);
      }
    });
  }
}

function applyFilters() {
  AppState.filters.search = document.getElementById("filterSearch")?.value || "";
  AppState.filters.field = document.getElementById("filterField")?.value || "";
  AppState.filters.state = document.getElementById("filterState")?.value || "";
  const container = document.getElementById("mentorResultsContainer");
  if (container) {
    const filtered = filterMentorsList();
    container.innerHTML = renderMentorResultsContent(filtered);
  }
}

function resetFilters() {
  AppState.filters = { search: "", field: "", state: "", district: "" };
  const searchInput = document.getElementById("filterSearch");
  const fieldSelect = document.getElementById("filterField");
  const stateSelect = document.getElementById("filterState");
  if (searchInput) searchInput.value = "";
  if (fieldSelect) fieldSelect.value = "";
  if (stateSelect) stateSelect.value = "";
  const container = document.getElementById("mentorResultsContainer");
  if (container) {
    const filtered = filterMentorsList();
    container.innerHTML = renderMentorResultsContent(filtered);
  }
}

// Reusable Mentor Card Component
function renderMentorCardSnippet(m) {
  const isMentor = AppState.currentRole === "mentor";
  const langText = Array.isArray(m.languages) ? m.languages.join(", ") : m.languages;

  return `
    <article class="mentor-card" id="card-${m.id}">
      <div class="card-top-row">
        <div class="mentor-avatar-wrap">
          <div class="avatar-circle" style="background-color: ${m.avatarColor || '#2563EB'};">
            ${escapeHtml(m.avatar || m.fullName.substring(0, 2).toUpperCase())}
          </div>
          <div>
            <h2 class="mentor-name">${escapeHtml(m.fullName)}</h2>
            <div class="mentor-college">${escapeHtml(m.graduationCollege)}</div>
          </div>
        </div>
        <span class="badge-demo">Demo Data</span>
      </div>

      <div class="mentor-degree-pill">
        ${escapeHtml(m.degree)} &bull; ${escapeHtml(m.graduationYear)}
      </div>

      <!-- Clear Location Display -->
      <div class="mentor-location-block">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>📍 ${escapeHtml(m.city)}, ${escapeHtml(m.district)} (${escapeHtml(m.state)})</span>
      </div>

      <p class="mentor-bio-snippet">
        "${escapeHtml(m.shortBio)}"
      </p>

      <div class="mentor-card-meta">
        <div class="meta-item">
          <strong>Field:</strong> ${escapeHtml(m.field)}
        </div>
        <div class="meta-item">
          <strong>Expertise:</strong> ${escapeHtml(m.expertise)}
        </div>
        <div class="meta-item">
          <strong>Languages:</strong> ${escapeHtml(langText)}
        </div>
      </div>

      <div class="card-footer-action">
        <div style="display: flex; gap: 0.5rem;">
          <a href="#mentor-detail/${m.id}" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="navigateTo('mentor-detail', '${m.id}')">
            View Details
          </a>
          ${isMentor ? `
            <a href="#mentor-detail/${m.id}" class="btn btn-outline-primary btn-sm" style="flex: 1;" onclick="navigateTo('mentor-detail', '${m.id}')">
              View Profile
            </a>
          ` : `
            <button type="button" class="btn btn-primary btn-sm" style="flex: 1;" onclick="openRequestModal('${m.id}')">
              Request Mentorship
            </button>
          `}
        </div>
      </div>
    </article>
  `;
}

// --------------------------------------------------------------------------
// 6. MENTOR DETAIL PAGE
// --------------------------------------------------------------------------
function renderMentorDetailPage(mentorId) {
  const mentor = AppState.mentors.find(m => m.id === mentorId) || AppState.mentors[0];
  const langText = Array.isArray(mentor.languages) ? mentor.languages.join(", ") : mentor.languages;
  const isMentor = AppState.currentRole === "mentor";

  return `
    <div class="page-view mentor-detail-container">
      <a href="#find-mentors" class="back-link-btn" onclick="navigateTo('find-mentors')">
        &larr; Back to Mentors Directory
      </a>

      <div class="detail-main-card">
        <!-- Hero Header -->
        <div class="detail-hero-banner">
          <div style="position: absolute; top: 1rem; right: 1.25rem;">
            <span class="badge-demo">Demo Profile Preview</span>
          </div>

          <div class="detail-header-content">
            <div class="detail-avatar-circle" style="background-color: ${mentor.avatarColor || '#2563EB'};">
              ${escapeHtml(mentor.avatar || mentor.fullName.substring(0, 2).toUpperCase())}
            </div>
            <div class="detail-header-text">
              <h1>${escapeHtml(mentor.fullName)}</h1>
              <div class="degree-line">${escapeHtml(mentor.degree)} &bull; Class of ${escapeHtml(mentor.graduationYear)}</div>
              <div class="college-line">${escapeHtml(mentor.graduationCollege)}</div>
            </div>
          </div>
        </div>

        <!-- Body & Details Grid -->
        <div class="detail-body-content">
          <div class="detail-info-grid">
            <div>
              <div class="detail-section-block">
                <h2>First-Generation Journey &amp; Story</h2>
                <p class="detail-bio-paragraph">
                  ${escapeHtml(mentor.shortBio)}
                </p>
              </div>

              <div class="detail-section-block">
                <h2>Mentorship Guidance Areas</h2>
                <div style="background-color: var(--bg-app); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
                  <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                    Key Topics &amp; Specialization:
                  </div>
                  <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0.75rem;">
                    ${escapeHtml(mentor.expertise)}
                  </p>
                  <div style="font-size: 0.8125rem; color: var(--text-muted);">
                    First-gen students can ask about syllabus decoding, low-cost prep strategies, government quota admissions, fee waiver schemes, and initial college adjustment.
                  </div>
                </div>
              </div>

              <div class="detail-cta-bar">
                ${isMentor ? `
                  <div style="background: var(--bg-muted); padding: 1rem; border-radius: var(--radius-md); font-size: 0.875rem; color: var(--text-secondary);">
                    <strong>Viewing as Graduate Mentor:</strong> To test submitting a mentorship request, switch to Student View above.
                  </div>
                ` : `
                  <button type="button" class="btn btn-primary btn-lg" onclick="openRequestModal('${mentor.id}')">
                    Request Mentorship From ${escapeHtml(mentor.fullName.split(" ")[0])}
                  </button>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                    Free mentorship request &bull; No payment required &bull; 100% community guided
                  </div>
                `}
              </div>
            </div>

            <!-- Sidebar Details -->
            <aside class="detail-sidebar-box">
              <div class="detail-sidebar-item">
                <div class="label">Location in India</div>
                <div class="value">
                  📍 ${escapeHtml(mentor.city)}, ${escapeHtml(mentor.district)}<br>
                  <span style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(mentor.state)}</span>
                </div>
              </div>

              <div class="detail-sidebar-item">
                <div class="label">Field of Expertise</div>
                <div class="value">${escapeHtml(mentor.field)}</div>
              </div>

              <div class="detail-sidebar-item">
                <div class="label">Mentorship Languages</div>
                <div class="value">${escapeHtml(langText)}</div>
              </div>

              <div class="detail-sidebar-item">
                <div class="label">Alma Mater</div>
                <div class="value" style="font-size: 0.875rem;">${escapeHtml(mentor.graduationCollege)}</div>
              </div>

              <div class="detail-sidebar-item">
                <div class="label">Graduation Year</div>
                <div class="value">${escapeHtml(mentor.graduationYear)}</div>
              </div>

              <div class="detail-sidebar-item">
                <div class="label">Status</div>
                <div class="value">
                  <span class="badge-status accepted">Verified Graduate</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 7. STUDENT DASHBOARD (With Mentor Contact Unlocked upon Accept)
// --------------------------------------------------------------------------
function renderStudentDashboard() {
  const p = AppState.studentProfile;
  const requests = AppState.sentRequests;

  return `
    <div class="page-view dashboard-page-container">
      <!-- Head Greeting Card -->
      <div class="dashboard-head-card">
        <div class="dashboard-welcome-info">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge-role">Student Dashboard</span>
            <span class="badge-demo">Demo Session</span>
          </div>
          <h1>Namaste, ${escapeHtml(p.fullName)}</h1>
          <p>Track your mentorship requests and find mentors who understand your background.</p>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <a href="#find-mentors" class="btn btn-primary" onclick="navigateTo('find-mentors')">
            Find New Mentors
          </a>
          <a href="#student-profile" class="btn btn-secondary" onclick="navigateTo('student-profile')">
            Edit Profile
          </a>
        </div>
      </div>

      <div class="dashboard-grid-layout">
        <!-- Profile Summary Card -->
        <div class="profile-summary-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">My Education Profile Summary</h2>
            <a href="#student-profile" class="btn btn-secondary btn-sm" onclick="navigateTo('student-profile')">Edit Profile</a>
          </div>

          <div class="profile-summary-grid">
            <div class="profile-field-item">
              <div class="label">Full Name</div>
              <div class="val">${escapeHtml(p.fullName)}</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Current Level</div>
              <div class="val">${escapeHtml(p.currentEducationLevel)}</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Intended Path</div>
              <div class="val">${escapeHtml(p.intendedCourse)}</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Home Location</div>
              <div class="val">📍 ${escapeHtml(p.city)}, ${escapeHtml(p.district)} (${escapeHtml(p.state)})</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Preferred Language</div>
              <div class="val">${escapeHtml(p.preferredLanguage)}</div>
            </div>
          </div>
        </div>

        <!-- Sent Requests Section -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">My Sent Mentorship Requests</h2>
              <p style="font-size: 0.875rem; color: var(--text-secondary);">Questions and guidance requests sent to graduate mentors</p>
            </div>
            <span class="badge-demo">Demo Requests List</span>
          </div>

          ${requests.length > 0 ? `
            <div class="requests-list">
              ${requests.map(req => {
                const isAccepted = req.status === "Accepted";
                return `
                  <div class="request-card" id="req-card-${req.id}">
                    <div class="request-card-head">
                      <div>
                        <div class="request-meta-title">Mentor: ${escapeHtml(req.mentorName)}</div>
                        <div class="request-meta-sub">${escapeHtml(req.mentorCollege)} &bull; 📍 ${escapeHtml(req.mentorLocation)}</div>
                      </div>
                      <div>
                        <span class="badge-status ${req.status.toLowerCase()}">
                          ${req.status === "Pending" ? "⏳ Pending Review" : req.status === "Accepted" ? "✓ Accepted" : "✕ Declined"}
                        </span>
                      </div>
                    </div>

                    <div class="request-topic-text">
                      <strong>My Question / Topic:</strong><br>
                      "${escapeHtml(req.topic)}"
                    </div>

                    ${isAccepted ? `
                      <!-- UNLOCKED MENTOR CONTACT CHANNELS UPON ACCEPTANCE -->
                      <div class="student-accepted-card">
                        <div class="student-accepted-header">
                          <div class="student-accepted-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span>Mentor Accepted &bull; Direct Contact Channels Unlocked</span>
                          </div>
                          <button type="button" class="btn btn-secondary btn-sm" onclick="copyToClipboard('${req.mentorEmail} | ${req.mentorPhone}', 'Copied mentor contact info!')">
                            📋 Copy All Details
                          </button>
                        </div>

                        <div class="contact-channels-list">
                          <a href="mailto:${req.mentorEmail || 'mentor@pehlipedhi.demo'}?subject=PehliPeedhi Mentorship Request Follow-up" class="contact-pill-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>Email: <strong>${escapeHtml(req.mentorEmail || 'mentor@pehlipedhi.demo')}</strong></span>
                          </a>

                          <a href="https://wa.me/${(req.mentorPhone || '919811122334').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.mentorName)},%20I%20am%20${encodeURIComponent(p.fullName)}%20from%20PehliPeedhi." target="_blank" rel="noopener" class="contact-pill-btn whatsapp-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>WhatsApp / Call: <strong>${escapeHtml(req.mentorPhone || '+91 98111 22334')}</strong></span>
                          </a>
                        </div>

                        ${req.mentorResponseNote ? `
                          <div class="mentor-note-display">
                            <strong>Message from Mentor ${escapeHtml(req.mentorName)}:</strong><br>
                            "${escapeHtml(req.mentorResponseNote)}"
                          </div>
                        ` : `
                          <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 0.4rem;">
                            You can now write to the mentor via email or message on WhatsApp to schedule your guidance discussion.
                          </div>
                        `}
                      </div>
                    ` : ""}

                    <div class="request-actions-row">
                      <div style="font-size: 0.8125rem; color: var(--text-muted);">
                        Sent on: <strong>${escapeHtml(req.date)}</strong> &bull; Language: <strong>${escapeHtml(req.studentLanguage || "Hindi")}</strong>
                      </div>
                      <div class="request-actions-group">
                        <a href="#mentor-detail/${req.mentorId}" class="btn btn-secondary btn-sm" onclick="navigateTo('mentor-detail', '${req.mentorId}')">
                          View Mentor Profile
                        </a>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div class="empty-state-box">
              <h3>You have not sent any mentorship requests yet</h3>
              <p>Explore the mentor directory to find graduates who match your study stream and state.</p>
              <a href="#find-mentors" class="btn btn-primary" style="margin-top: 1rem;" onclick="navigateTo('find-mentors')">
                Explore Mentors Directory
              </a>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 8. MENTOR DASHBOARD (With Student Contact Unlocked upon Accept)
// --------------------------------------------------------------------------
function renderMentorDashboard() {
  const m = AppState.mentorProfile;
  const incoming = AppState.incomingRequests;

  return `
    <div class="page-view dashboard-page-container">
      <!-- Head Greeting Card -->
      <div class="dashboard-head-card">
        <div class="dashboard-welcome-info">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge-role" style="background-color: var(--accent-saffron-light); color: var(--accent-saffron);">Graduate Mentor Dashboard</span>
            <span class="badge-demo">Demo Session</span>
          </div>
          <h1>Namaste, ${escapeHtml(m.fullName)}</h1>
          <p>Thank you for guiding the next generation of first-in-family graduates.</p>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <a href="#mentor-profile" class="btn btn-primary" onclick="navigateTo('mentor-profile')">
            Edit Mentor Profile
          </a>
          <button type="button" class="btn btn-secondary" onclick="resetDemoRequests()">
            Reset Demo Requests
          </button>
        </div>
      </div>

      <div class="dashboard-grid-layout">
        <!-- Mentor Profile Summary Box -->
        <div class="profile-summary-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">My Mentor Profile Overview</h2>
            <a href="#mentor-profile" class="btn btn-secondary btn-sm" onclick="navigateTo('mentor-profile')">Edit Profile</a>
          </div>

          <div class="profile-summary-grid">
            <div class="profile-field-item">
              <div class="label">College / Alma Mater</div>
              <div class="val">${escapeHtml(m.graduationCollege)}</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Degree &amp; Year</div>
              <div class="val">${escapeHtml(m.degree)} (${escapeHtml(m.graduationYear)})</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Field of Study</div>
              <div class="val">${escapeHtml(m.field)}</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Location</div>
              <div class="val">📍 ${escapeHtml(m.city)}, ${escapeHtml(m.district)} (${escapeHtml(m.state)})</div>
            </div>
            <div class="profile-field-item">
              <div class="label">Languages</div>
              <div class="val">${escapeHtml(m.languages)}</div>
            </div>
          </div>
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light); font-size: 0.875rem; color: var(--text-secondary);">
            <strong>Short Bio:</strong> "${escapeHtml(m.shortBio)}"
          </div>
        </div>

        <!-- Incoming Requests Section -->
        <div id="incomingRequestsSection">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">Incoming Student Requests</h2>
              <p style="font-size: 0.875rem; color: var(--text-secondary);">First-generation students seeking your guidance</p>
            </div>
            <span class="badge-demo">Interactive Demo Actions</span>
          </div>

          ${incoming.length > 0 ? `
            <div class="requests-list">
              ${incoming.map(req => {
                const isAccepted = req.status === "Accepted";
                const studentEmail = req.studentEmail || `${req.studentName.toLowerCase().replace(/[^a-z]/g, '')}@pehlipedhi.demo`;
                const studentPhone = req.studentPhone || "+91 98765 43210";

                return `
                  <div class="request-card" id="inc-card-${req.id}">
                    <div class="request-card-head">
                      <div>
                        <div class="request-meta-title">Student: ${escapeHtml(req.studentName)}</div>
                        <div class="request-meta-sub">
                          ${escapeHtml(req.studentCurrentLevel)} &bull; Intended: <strong>${escapeHtml(req.intendedCourse)}</strong> &bull; 📍 ${escapeHtml(req.studentLocation)}
                        </div>
                      </div>
                      <div>
                        <span class="badge-status ${req.status.toLowerCase()}" id="status-badge-${req.id}">
                          ${req.status === "Pending" ? "⏳ Pending Review" : req.status === "Accepted" ? "✓ Accepted" : "✕ Declined"}
                        </span>
                      </div>
                    </div>

                    <div class="request-topic-text">
                      <strong>Student Question / Mentorship Need:</strong><br>
                      "${escapeHtml(req.topic)}"
                    </div>

                    ${isAccepted ? `
                      <!-- UNLOCKED STUDENT CONTACT CHANNELS (After Accept) -->
                      <div class="contact-revealed-card">
                        <div class="contact-card-header">
                          <div class="contact-header-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span>Student Contact Channels (Direct Guidance Access)</span>
                          </div>
                          <button type="button" class="btn btn-secondary btn-sm" onclick="copyToClipboard('${studentEmail} | ${studentPhone}', 'Copied student contact details!')">
                            📋 Copy Contact Info
                          </button>
                        </div>

                        <div class="contact-channels-list">
                          <a href="mailto:${studentEmail}?subject=PehliPeedhi Mentorship: Guidance Response from ${encodeURIComponent(m.fullName)}" class="contact-pill-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>Send Email: <strong>${escapeHtml(studentEmail)}</strong></span>
                          </a>

                          <a href="https://wa.me/${studentPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.studentName)},%20I%20am%20${encodeURIComponent(m.fullName)}%20from%20PehliPeedhi.%20I%20have%20accepted%20your%20mentorship%20request." target="_blank" rel="noopener" class="contact-pill-btn whatsapp-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>WhatsApp: <strong>${escapeHtml(studentPhone)}</strong></span>
                          </a>

                          <a href="tel:${studentPhone.replace(/[^0-9+]/g, '')}" class="contact-pill-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <span>Call Phone</span>
                          </a>
                        </div>

                        <!-- Guidance Message Composer -->
                        <div class="mentor-note-composer">
                          <label for="note-input-${req.id}">Your Guidance Note / Contact Instructions to ${escapeHtml(req.studentName)}:</label>
                          <textarea id="note-input-${req.id}" placeholder="e.g. Happy to help! Let's connect on WhatsApp this Saturday at 4 PM to discuss your college admission questions or send me your syllabus breakdown.">${escapeHtml(req.mentorResponseNote || '')}</textarea>
                          <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem; gap: 0.5rem;">
                            <button type="button" class="btn btn-primary btn-sm" onclick="saveMentorGuidanceNote('${req.id}')">
                              Save Guidance Note
                            </button>
                          </div>
                        </div>
                      </div>
                    ` : ""}

                    <div class="request-actions-row">
                      <div style="font-size: 0.8125rem; color: var(--text-muted);">
                        Received: <strong>${escapeHtml(req.date)}</strong> &bull; Preferred Language: <strong>${escapeHtml(req.preferredLanguage)}</strong>
                      </div>

                      <div class="request-actions-group" id="action-btns-${req.id}">
                        ${req.status === "Pending" ? `
                          <button type="button" class="btn btn-success btn-sm" onclick="respondToRequest('${req.id}', 'Accepted')">
                            ✓ Accept &amp; View Contact
                          </button>
                          <button type="button" class="btn btn-danger-outline btn-sm" onclick="respondToRequest('${req.id}', 'Declined')">
                            ✕ Decline
                          </button>
                        ` : `
                          <span style="font-size: 0.8125rem; color: var(--text-muted);">
                            Status: <strong>${escapeHtml(req.status)}</strong>
                          </span>
                          <button type="button" class="btn btn-secondary btn-sm" onclick="respondToRequest('${req.id}', 'Pending')">
                            Reset to Pending
                          </button>
                        `}
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div class="empty-state-box">
              <h3>No incoming requests at the moment</h3>
              <p>When students submit mentorship requests to you, they will appear here.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// Mentor Accept / Decline Request Action
function respondToRequest(requestId, newStatus) {
  const req = AppState.incomingRequests.find(r => r.id === requestId);
  if (req) {
    req.status = newStatus;
    if (newStatus === "Accepted" && !req.mentorResponseNote) {
      req.mentorResponseNote = `Hi ${req.studentName}! I have accepted your mentorship request. Feel free to message me on WhatsApp or email me so we can schedule our discussion.`;
    }
    saveState();
    renderCurrentView();

    if (newStatus === "Accepted") {
      showToast(`Request accepted! Contact details for ${req.studentName} are unlocked below.`);
    } else if (newStatus === "Declined") {
      showToast("Request marked as declined.");
    }
  }
}

function saveMentorGuidanceNote(requestId) {
  const textarea = document.getElementById(`note-input-${requestId}`);
  if (!textarea) return;
  const note = textarea.value.trim();
  const req = AppState.incomingRequests.find(r => r.id === requestId);
  if (req) {
    req.mentorResponseNote = note;
    saveState();
    showToast("Guidance note saved for student!");
  }
}

function resetDemoRequests() {
  AppState.incomingRequests = [...SAMPLE_INCOMING_REQUESTS];
  AppState.sentRequests = [...SAMPLE_SENT_REQUESTS];
  saveState();
  renderCurrentView();
  showToast("Demo requests reset to initial state.");
}

// --------------------------------------------------------------------------
// CLIPBOARD COPY UTILITY & FLOATING TOAST
// --------------------------------------------------------------------------
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || "Copied to clipboard!");
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast(successMsg || "Copied to clipboard!");
}

function showToast(msg) {
  const existing = document.querySelector(".copy-feedback-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "copy-feedback-toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2800);
}

// --------------------------------------------------------------------------
// MODAL: REQUEST MENTORSHIP
// --------------------------------------------------------------------------
let activeRequestMentorId = null;

function openRequestModal(mentorId) {
  activeRequestMentorId = mentorId;
  const mentor = AppState.mentors.find(m => m.id === mentorId) || AppState.mentors[0];

  const modal = document.getElementById("requestModal");
  const modalMentorName = document.getElementById("modalMentorName");
  const modalTitle = document.getElementById("modalTitle");
  const langSelect = document.getElementById("reqStudentLanguage");

  if (modalMentorName) modalMentorName.textContent = mentor.fullName;
  if (modalTitle) modalTitle.textContent = `Request Mentorship from ${mentor.fullName}`;

  if (langSelect) {
    langSelect.innerHTML = LANGUAGES_LIST.map(lang => 
      `<option value="${lang}" ${lang === AppState.studentProfile.preferredLanguage ? "selected" : ""}>${lang}</option>`
    ).join("");
  }

  // Pre-fill student preferred topic placeholder if empty
  const topicText = document.getElementById("reqTopic");
  if (topicText && !topicText.value) {
    topicText.value = `I am a first-generation student interested in ${AppState.studentProfile.intendedCourse}. Could you share advice on how you prepared and navigated college admissions?`;
  }

  if (modal) {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeRequestModal() {
  const modal = document.getElementById("requestModal");
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
}

function handleRequestSubmit(e) {
  e.preventDefault();
  const mentor = AppState.mentors.find(m => m.id === activeRequestMentorId) || AppState.mentors[0];
  const topic = document.getElementById("reqTopic").value.trim();
  const lang = document.getElementById("reqStudentLanguage").value;

  const newSentRequest = {
    id: `req-${Date.now()}`,
    mentorId: mentor.id,
    mentorName: mentor.fullName,
    mentorCollege: mentor.graduationCollege,
    mentorField: mentor.field,
    mentorLocation: `${mentor.city}, ${mentor.state}`,
    mentorEmail: mentor.email || "mentor@pehlipedhi.demo",
    mentorPhone: mentor.phone || "+91 98111 22334",
    topic: topic,
    studentLanguage: lang,
    date: "Just now",
    status: "Pending",
    statusMessage: "Mentor will review your question soon.",
    mentorResponseNote: ""
  };

  AppState.sentRequests.unshift(newSentRequest);

  // Also simulate adding an incoming request if mentor dashboard is inspected
  const newIncomingRequest = {
    id: `inc-${Date.now()}`,
    studentName: AppState.studentProfile.fullName,
    studentEmail: AppState.studentProfile.email || "aman.student@pehlipedhi.demo",
    studentPhone: AppState.studentProfile.phone || "+91 98765 43210",
    studentCurrentLevel: AppState.studentProfile.currentEducationLevel,
    studentLocation: `${AppState.studentProfile.city}, ${AppState.studentProfile.state}`,
    intendedCourse: AppState.studentProfile.intendedCourse,
    preferredLanguage: lang,
    topic: topic,
    date: "Just now",
    status: "Pending",
    mentorResponseNote: ""
  };
  AppState.incomingRequests.unshift(newIncomingRequest);

  saveState();
  closeRequestModal();

  // Route to student dashboard so user sees their newly sent request immediately
  AppState.currentRole = "student";
  saveState();
  navigateTo("student-dashboard");
  showToast("Mentorship request sent successfully!");
}

// --------------------------------------------------------------------------
// UTILITIES & LIFECYCLE
// --------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Mobile Nav Toggle
function setupMobileNav() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const mainNav = document.getElementById("mainNav");
  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener("click", () => {
      mainNav.classList.toggle("mobile-open");
    });
  }
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeRequestModal();
  }
});

// Close modal on overlay click
window.addEventListener("click", (e) => {
  const modal = document.getElementById("requestModal");
  if (e.target === modal) {
    closeRequestModal();
  }
});

// Initialize on page load and hash changes
window.addEventListener("hashchange", renderCurrentView);

window.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  renderCurrentView();
});
