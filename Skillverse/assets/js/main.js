// Global state management
const appState = {
    currentUser: null,
    isAuthenticated: false,
    currentSection: 'landingPage',
    apiBaseUrl: 'http://localhost:3000/api',
    courses: [],
    userSkills: [],
    forumPosts: []
};

// API Configuration
const API_ENDPOINTS = {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    verify: '/auth/verify',
    profile: '/user/profile',
    courses: '/courses',
    skills: '/skills',
    forum: '/forum',
    marketplace: '/marketplace'
};

// Utility Functions
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: #c6f6d5;
        color: #22543d;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(appState.apiBaseUrl + endpoint, config);
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Navigation Functions
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    
    navbarContainer.innerHTML = `
        <nav class="navbar" id="navbar" style="display: block;">
            <div class="nav-container">
                <div class="logo">SkillVerse</div>
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="dashboard.html" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
                    <li><a href="course.html" class="nav-link ${currentPage === 'course' ? 'active' : ''}">Courses</a></li>
                    <li><a href="forum.html" class="nav-link ${currentPage === 'forum' ? 'active' : ''}">Forum</a></li>
                    <li><a href="marketplace.html" class="nav-link ${currentPage === 'marketplace' ? 'active' : ''}">Marketplace</a></li>
                    <li><a href="profile.html" class="nav-link ${currentPage === 'profile' ? 'active' : ''}">Profile</a></li>
                </ul>
                <div class="user-menu">
                    <span id="userGreeting">Welcome, User!</span>
                    <button class="btn-logout" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </nav>
    `;
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('mobile-open');
}

// Authentication Functions
/*async function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html') && 
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return false;
    }

    try {
        const response = await apiCall(API_ENDPOINTS.verify);
        appState.currentUser = response.user;
        appState.isAuthenticated = true;
        updateUserUI();
        return true;
    } catch (error) {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
        return false;
    }
}*/

function updateUserUI() {
    if (appState.currentUser) {
        const userGreeting = document.getElementById('userGreeting');
        const dashboardUserName = document.getElementById('dashboardUserName');
        
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${appState.currentUser.name}!`;
        }
        
        if (dashboardUserName) {
            dashboardUserName.textContent = appState.currentUser.name;
        }
    }
}

function logout() {
    localStorage.removeItem('authToken');
    appState.currentUser = null;
    appState.isAuthenticated = false;
    showSuccess('Logged out successfully');
    window.location.href = 'index.html';
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Course Modal Functions
function closeCourse() {
    closeModal('courseModal');
}

function closeNewPost() {
    closeModal('newPostModal');
}

function closeCreateOffer() {
    closeModal('createOfferModal');
}

function closeCertificateModal() {
    closeModal('certificateModal');
}

// Generic modal close on outside click
function setupModalCloseHandlers() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
}

// Loading states
function setLoadingState(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isLoading) {
            element.disabled = true;
            element.classList.add('loading');
            element.setAttribute('data-original-text', element.textContent);
            element.textContent = 'Loading...';
        } else {
            element.disabled = false;
            element.classList.remove('loading');
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-original-text');
            }
        }
    }
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', width: '33%' };
    if (strength <= 3) return { level: 'medium', width: '66%' };
    return { level: 'strong', width: '100%' };
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    // Load navbar for authenticated pages
    loadNavbar();
    
    // Setup modal handlers
    setupModalCloseHandlers();
    
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'course.html', 'forum.html', 'marketplace.html', 'profile.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) return;
    }

    // Initialize page-specific functionality
    const pageName = currentPage.replace('.html', '');
    if (window[`init${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`]) {
        window[`init${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`]();
    }
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        apiCall,
        showSuccess,
        showError,
        formatTimeAgo,
        validateEmail,
        validatePassword,
        getPasswordStrength,
        debounce,
        saveToLocalStorage,
        getFromLocalStorage
    };
}