// Authentication System
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('beautyUsers');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('beautyUsers', JSON.stringify(this.users));
    }

    // Get current logged in user
    getCurrentUser() {
        const user = localStorage.getItem('currentBeautyUser');
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentBeautyUser', JSON.stringify(user));
        this.updateUI();
    }

    // Clear current user (logout)
    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentBeautyUser');
        this.updateUI();
    }

    // Register new user
    register(name, email, phone, password) {
        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered!' };
        }

        // Validate password length
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters!' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password,
            createdAt: new Date().toISOString(),
            orders: []
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login after registration
        this.setCurrentUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        });

        return { success: true, message: 'Account created successfully!' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password!' };
        }

        this.setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        });

        return { success: true, message: 'Login successful!' };
    }

    // Logout
    logout() {
        this.clearCurrentUser();
        return { success: true, message: 'Logged out successfully!' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update UI based on login status
    updateUI() {
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userMenuName = document.getElementById('userMenuName');
        const userMenuEmail = document.getElementById('userMenuEmail');
        
        if (this.isLoggedIn()) {
            if (userNameDisplay) userNameDisplay.textContent = this.currentUser.name.split(' ')[0];
            if (userMenuName) userMenuName.textContent = this.currentUser.name;
            if (userMenuEmail) userMenuEmail.textContent = this.currentUser.email;
        } else {
            if (userNameDisplay) userNameDisplay.textContent = 'Account';
        }
    }

    // Get user orders
    getUserOrders() {
        const user = this.users.find(u => u.id === this.currentUser?.id);
        return user ? user.orders : [];
    }

    // Add order to user history
    addOrder(order) {
        if (!this.isLoggedIn()) return false;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].orders.push({
                ...order,
                orderDate: new Date().toISOString(),
                orderId: 'ORD-' + Date.now()
            });
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Initialize event listeners
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // DOM Elements
        const userIcon = document.getElementById('userIcon');
        const authModal = document.getElementById('authModal');
        const authClose = document.getElementById('authClose');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const loginFormElement = document.getElementById('loginFormElement');
        const registerFormElement = document.getElementById('registerFormElement');
        const logoutBtn = document.getElementById('logoutBtn');
        const userMenu = document.getElementById('userMenu');
        const authOverlay = document.querySelector('.auth-overlay');

        // Show/Hide Auth Modal
        window.showAuthModal = () => {
            if (this.isLoggedIn()) {
                if (userMenu) userMenu.classList.toggle('show');
            } else {
                if (authModal) authModal.classList.add('active');
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                if (loginForm) loginForm.classList.add('active');
                if (registerForm) registerForm.classList.remove('active');
            }
        };

        function closeAuthModal() {
            if (authModal) authModal.classList.remove('active');
        }

        function switchToRegister() {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            if (loginForm) loginForm.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
        }

        function switchToLogin() {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            if (registerForm) registerForm.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
        }

        // Handle Login
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = this.login(email, password);
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                closeAuthModal();
                // Clear form
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                this.showNotification(result.message, 'error');
            }
        }

        // Handle Register
        function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validate
            if (password !== confirmPassword) {
                this.showNotification('Passwords do not match!', 'error');
                return;
            }
            
            const result = this.register(name, email, phone, password);
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                closeAuthModal();
                // Clear form
                document.getElementById('regName').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPhone').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regConfirmPassword').value = '';
            } else {
                this.showNotification(result.message, 'error');
            }
        }

        // Handle Logout
        function handleLogout(e) {
            e.preventDefault();
            this.logout();
            this.showNotification('Logged out successfully!', 'success');
            if (userMenu) userMenu.classList.remove('show');
        }

        // Show notification
        this.showNotification = function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification-toast ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'linear-gradient(135deg, #ff6b6b, #ff4444)'};
                color: white;
                padding: 12px 20px;
                border-radius: 30px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.3s ease;
                font-size: 0.9rem;
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        };

        // Event Listeners
        if (userIcon) userIcon.addEventListener('click', () => window.showAuthModal());
        if (authClose) authClose.addEventListener('click', closeAuthModal);
        if (showRegister) showRegister.addEventListener('click', switchToRegister);
        if (showLogin) showLogin.addEventListener('click', switchToLogin);
        if (loginFormElement) loginFormElement.addEventListener('submit', handleLogin.bind(this));
        if (registerFormElement) registerFormElement.addEventListener('submit', handleRegister.bind(this));
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout.bind(this));
        if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (userMenu && userIcon && !userIcon.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        });
    }
}

// Initialize Auth System
const auth = new AuthSystem();

// Make auth available globally
window.auth = auth;