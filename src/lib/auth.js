import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT Functions
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Client-side Authentication utility functions

/**
 * Check if user is authenticated
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export function getAuthUser() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Check if user has specific role
 * @param {string} requiredRole - Required role (admin, user, etc.)
 * @returns {boolean} True if user has the required role
 */
export function hasRole(requiredRole) {
  const user = getAuthUser();
  return user && user.role === requiredRole;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  return !!(token && userData);
}

/**
 * Logout user - clears storage and dispatches event
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Dispatch custom event to notify all components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('userLogout'));
  }
}

/**
 * Redirect to login if not authenticated
 * @param {Function} router - Next.js router instance
 * @param {string} redirectPath - Path to redirect to (default: '/auth/login')
 */
export function requireAuth(router, redirectPath = '/auth/login') {
  if (!isAuthenticated()) {
    router.push(redirectPath);
    return false;
  }
  return true;
}

/**
 * Redirect if user doesn't have required role
 * @param {Function} router - Next.js router instance
 * @param {string} requiredRole - Required role
 * @param {string} redirectPath - Path to redirect to (default: '/auth/login')
 */
export function requireRole(router, requiredRole, redirectPath = '/auth/login') {
  if (!hasRole(requiredRole)) {
    router.push(redirectPath);
    return false;
  }
  return true;
}
