// Dashboard Functions
async function loadDashboardData() {
    try {
        // Load user stats
        const stats = await apiCall('/user/stats');
        if (stats) {
            updateStatsDisplay(stats);
        }

        // Load user skills
        const skills = await apiCall(API_ENDPOINTS.skills);
        if (skills) {
            renderUserSkills(skills);
        }

        // Load recent forum activity
        const recentPosts = await apiCall('/forum/recent?limit=3');
        if (recentPosts) {
            renderRecentForumActivity(recentPosts);
        }

        // Load available courses
        const courses = await apiCall(API_ENDPOINTS.courses);
        if (courses) {
            renderAvailableCourses(courses);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        loadMockDashboardData();
    }
}

function updateStatsDisplay(stats) {
    const elements = {
        coursesCompleted: document.getElementById('coursesCompleted'),
        skillsLearned: document.getElementById('skillsLearned'),
        certificatesEarned: document.getElementById('certificatesEarned'),
        forumPosts: document.getElementById('forumPosts')
    };

    Object.keys(elements).forEach(key => {
        if (elements[key]) {
            animateCounter(elements[key], stats[key] || 0);
        }
    });
}

function animateCounter(element, targetValue) {
    const startValue = 0;
    const duration = 1000;
    const startTime = Date.now();

    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic(progress));
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function loadMockDashboardData() {
    // Mock data for demo purposes
    const mockStats = {
        coursesCompleted: 12,
        skillsLearned: 24,
        certificatesEarned: 8,
        forumPosts: 156
    };
    updateStatsDisplay(mockStats);

    const mockSkills = [
        { name: 'JavaScript', level: 'Advanced', progress: 90 },
        { name: 'Python', level: 'Intermediate', progress: 70 },
        { name: 'React', level: 'Advanced', progress: 85 },
        { name: 'Node.js', level: 'Intermediate', progress: 75 },
        { name: 'CSS', level: 'Advanced', progress: 88 }
    ];
    renderUserSkills(mockSkills);

    const mockPosts = [
        {
            id: 1,
            author: 'John Doe',
            content: 'How do I implement authentication in React?',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            replies: 5,
            likes: 12
        },
        {
            id: 2,
            author: 'Jane Smith',
            content: 'Best practices for API design?',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            replies: 3,
            likes: 8
        }
    ];
    renderRecentForumActivity(mockPosts);
}

function renderUserSkills(skills) {
    const skillsContainer = document.getElementById('userSkills');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-badge" onclick="showSkillDetails('${skill.name}')">
            ${skill.name} 
            <span class="skill-level">${skill.level}</span>
        </div>
    `).join('');
}

function renderRecentForumActivity(posts) {
    const activityContainer = document.getElementById('recentForumActivity');
    if (!activityContainer) return;

    activityContainer.innerHTML = posts.map(post => `
        <div class="forum-post" onclick="openForumPost(${post.id})">
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${formatTimeAgo(post.createdAt)}</span>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <span class="action-btn">
                    <i class="fas fa-thumbs-up"></i> ${post.likes || 0}
                </span>
                <span class="action-btn">
                    <i class="fas fa-reply"></i> ${post.replies || 0}
                </span>
            </div>
        </div>
    `).join('');
}

function renderAvailableCourses(courses) {
    const coursesContainer = document.getElementById('availableCourses');
    if (!coursesContainer) return;

    const mockCourses = [
        {
            id: 'web-dev',
            title: 'Web Development',
            description: 'Learn HTML, CSS, JavaScript',
            icon: 'fa-code',
            progress: 60
        },
        {
            id: 'data-science',
            title: 'Data Science',
            description: 'Python, Machine Learning',
            icon: 'fa-chart-bar',
            progress: 25
        },
        {
            id: 'design',
            title: 'UI/UX Design',
            description: 'Design principles, Figma',
            icon: 'fa-palette',
            progress: 0
        }
    ];

    coursesContainer.innerHTML = mockCourses.map(course => `
        <div class="course-card" onclick="openCourse('${course.id}')">
            <i class="fas ${course.icon} course-icon"></i>
            <div>
                <h4>${course.title}</h4>
                <p>${course.description}</p>
                ${course.progress > 0 ? `
                    <div class="progress-bar" style="margin-top: 0.5rem;">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <small style="color: var(--text-light);">${course.progress}% complete</small>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Course interaction functions
function openCourse(courseId) {
    window.location.href = `course.html?id=${courseId}`;
}

function showSkillDetails(skillName) {
    showSuccess(`${skillName} skill details - Feature coming soon!`);
}

function openForumPost(postId) {
    window.location.href = `forum.html?post=${postId}`;
}

// Quick actions
function createNewCourse() {
    showSuccess('Course creation feature coming soon!');
}

function viewAllCourses() {
    window.location.href = 'course.html';
}

function viewAllForumPosts() {
    window.location.href = 'forum.html';
}

// Admin Dashboard Functions
function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load tab-specific data
    loadAdminTabData(tabName);
}

async function loadAdminTabData(tabName) {
    try {
        switch (tabName) {
            case 'users':
                await loadUsersData();
                break;
            case 'courses':
                await loadCoursesManagement();
                break;
            case 'analytics':
                await loadAnalytics();
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(`Error loading ${tabName} data:`, error);
    }
}

async function loadUsersData() {
    // Mock user data for demo
    console.log('Loading users data...');
}

async function loadCoursesManagement() {
    console.log('Loading courses management...');
}

async function loadAnalytics() {
    console.log('Loading analytics...');
    // Here you could integrate with Chart.js or similar
}

// User management functions
function viewUser(userId) {
    showSuccess(`Viewing user ${userId} - Feature coming soon!`);
}

function editUser(userId) {
    showSuccess(`Editing user ${userId} - Feature coming soon!`);
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        showSuccess(`User ${userId} suspended`);
    }
}

function createCourse() {
    showSuccess('Course creation - Feature coming soon!');
}

function editCourse(courseId) {
    showSuccess(`Editing course ${courseId} - Feature coming soon!`);
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        showSuccess(`Course ${courseId} deleted`);
    }
}

function exportUsers() {
    showSuccess('Exporting users - Feature coming soon!');
}

// Search and filter functions
function setupDashboardSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        const debouncedSearch = debounce((searchTerm) => {
            performSearch(searchTerm, input.dataset.searchType || 'general');
        }, 300);
        
        input.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    });
}

function performSearch(searchTerm, searchType) {
    console.log(`Searching for "${searchTerm}" in ${searchType}`);
    // Implement actual search functionality based on search type
}

// Dashboard notifications
function showDashboardNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles for notifications
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Initialize dashboard
function initDashboard() {
    loadDashboardData();
    setupDashboardSearch();
    
    // Setup refresh functionality
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData();
            showDashboardNotification('Dashboard refreshed', 'success');
        });
    }
}

// Export for global access
window.openCourse = openCourse;
window.showSkillDetails = showSkillDetails;
window.openForumPost = openForumPost;
window.showAdminTab = showAdminTab;
window.viewUser = viewUser;
window.editUser = editUser;
window.suspendUser = suspendUser;
window.createCourse = createCourse;
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.exportUsers = exportUsers;