// Authentication functions
/*async function login(email, password) {
    try {
        setLoadingState('loginSubmit', true);
        
        const response = await apiCall(API_ENDPOINTS.login, 'POST', {
            email,
            password
        });

        // Store auth token
        localStorage.setItem('authToken', response.token);
        
        // Update app state
        appState.currentUser = response.user;
        appState.isAuthenticated = true;
        
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showError('loginError', error.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoadingState('loginSubmit', false);
    }
}*/



async function login(email, password) {
    try {
        setLoadingState('loginSubmit', true);
        
        // Mock authentication - bypass API call
        if (email && password) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create mock user data
            const mockUser = {
                id: 1,
                name: email.split('@')[0],
                email: email
            };
            
            // Store mock token
            localStorage.setItem('authToken', 'mock-token-' + Date.now());
            
            // Update app state
            appState.currentUser = mockUser;
            appState.isAuthenticated = true;
            
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            throw new Error('Please enter email and password');
        }
        
    } catch (error) {
        showError('loginError', error.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoadingState('loginSubmit', false);
    }
}

async function register(name, email, password) {
    try {
        setLoadingState('registerSubmit', true);
        
        const response = await apiCall(API_ENDPOINTS.register, 'POST', {
            name,
            email,
            password
        });

        // Store auth token
        localStorage.setItem('authToken', response.token);
        
        // Update app state
        appState.currentUser = response.user;
        appState.isAuthenticated = true;
        
        showSuccess('Registration successful! Welcome to SkillVerse!');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showError('registerError', error.message || 'Registration failed. Please try again.');
    } finally {
        setLoadingState('registerSubmit', false);
    }
}

// Form validation
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    let isValid = true;
    
    // Clear previous errors
    clearFieldErrors();
    
    // Validate email
    if (!email) {
        showFieldError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Clear previous errors
    clearFieldErrors();
    
    // Validate name
    if (!name) {
        showFieldError('registerName', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('registerName', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showFieldError('registerEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError('registerEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showFieldError('registerPassword', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showFieldError('registerPassword', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.remove('error');
    field.classList.add('success');
    
    // Remove existing messages
    const existingError = field.parentNode.querySelector('.field-error');
    const existingSuccess = field.parentNode.querySelector('.field-success');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
    
    // Add success message
    if (message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'field-success';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        field.parentNode.appendChild(successDiv);
    }
}

function clearFieldErrors() {
    const errorFields = document.querySelectorAll('.form-input.error');
    const successFields = document.querySelectorAll('.form-input.success');
    const errorMessages = document.querySelectorAll('.field-error, .field-success');
    
    errorFields.forEach(field => field.classList.remove('error'));
    successFields.forEach(field => field.classList.remove('success'));
    errorMessages.forEach(msg => msg.remove());
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('passwordStrengthFill');
    
    if (!strengthIndicator || !strengthFill) return;
    
    const strength = getPasswordStrength(password);
    
    strengthFill.style.width = strength.width;
    strengthFill.className = `password-strength-fill ${strength.level}`;
    
    if (password.length === 0) {
        strengthIndicator.style.display = 'none';
    } else {
        strengthIndicator.style.display = 'block';
    }
}

// Social login handlers
async function loginWithGoogle() {
    try {
        // In a real app, this would use Google OAuth
        showError('loginError', 'Social login not implemented yet');
    } catch (error) {
        showError('loginError', 'Google login failed');
    }
}

async function loginWithGitHub() {
    try {
        // In a real app, this would use GitHub OAuth
        showError('loginError', 'Social login not implemented yet');
    } catch (error) {
        showError('loginError', 'GitHub login failed');
    }
}

// Initialize auth pages
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateLoginForm()) return;
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            await login(email, password);
        });
        
        // Real-time validation
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        
        if (loginEmail) {
            loginEmail.addEventListener('blur', () => {
                const email = loginEmail.value;
                if (email && validateEmail(email)) {
                    showFieldSuccess('loginEmail');
                } else if (email) {
                    showFieldError('loginEmail', 'Please enter a valid email');
                }
            });
            
            loginEmail.addEventListener('input', () => {
                if (loginEmail.classList.contains('error')) {
                    clearFieldErrors();
                }
            });
        }
        
        if (loginPassword) {
            loginPassword.addEventListener('input', () => {
                if (loginPassword.classList.contains('error')) {
                    clearFieldErrors();
                }
            });
        }
    }
}

function initRegister() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateRegisterForm()) return;
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            await register(name, email, password);
        });
        
        // Real-time validation
        const registerName = document.getElementById('registerName');
        const registerEmail = document.getElementById('registerEmail');
        const registerPassword = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (registerName) {
            registerName.addEventListener('blur', () => {
                const name = registerName.value;
                if (name && name.length >= 2) {
                    showFieldSuccess('registerName');
                } else if (name) {
                    showFieldError('registerName', 'Name must be at least 2 characters');
                }
            });
        }
        
        if (registerEmail) {
            registerEmail.addEventListener('blur', () => {
                const email = registerEmail.value;
                if (email && validateEmail(email)) {
                    showFieldSuccess('registerEmail');
                } else if (email) {
                    showFieldError('registerEmail', 'Please enter a valid email');
                }
            });
        }
        
        if (registerPassword) {
            // Create password strength indicator if it doesn't exist
            if (!document.getElementById('passwordStrength')) {
                const strengthDiv = document.createElement('div');
                strengthDiv.id = 'passwordStrength';
                strengthDiv.className = 'password-strength';
                strengthDiv.innerHTML = '<div id="passwordStrengthFill" class="password-strength-fill"></div>';
                registerPassword.parentNode.appendChild(strengthDiv);
            }
            
            registerPassword.addEventListener('input', () => {
                const password = registerPassword.value;
                updatePasswordStrength(password);
                
                if (password && validatePassword(password)) {
                    showFieldSuccess('registerPassword');
                } else if (password) {
                    showFieldError('registerPassword', 'Password must be at least 8 characters');
                }
                
                // Also validate confirm password if it has a value
                const confirmPass = document.getElementById('confirmPassword');
                if (confirmPass && confirmPass.value) {
                    if (password === confirmPass.value) {
                        showFieldSuccess('confirmPassword');
                    } else {
                        showFieldError('confirmPassword', 'Passwords do not match');
                    }
                }
            });
        }
        
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', () => {
                const password = registerPassword.value;
                const confirmPass = confirmPassword.value;
                
                if (confirmPass && password === confirmPass) {
                    showFieldSuccess('confirmPassword');
                } else if (confirmPass) {
                    showFieldError('confirmPassword', 'Passwords do not match');
                }
            });
        }
        
        // Clear errors on input
        [registerName, registerEmail, registerPassword, confirmPassword].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        field.classList.remove('error');
                        const errorMsg = field.parentNode.querySelector('.field-error');
                        if (errorMsg) errorMsg.remove();
                    }
                });
            }
        });
    }
}

// Check if user is already logged in and redirect
function checkExistingAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token is still valid
        apiCall(API_ENDPOINTS.verify)
            .then(() => {
                window.location.href = 'dashboard.html';
            })
            .catch(() => {
                localStorage.removeItem('authToken');
            });
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check if user is already authenticated
    checkExistingAuth();
    
    if (currentPage === 'login.html') {
        initLogin();
    } else if (currentPage === 'register.html') {
        initRegister();
    }
});