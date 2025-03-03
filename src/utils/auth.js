import users from '../data/users.json';

// Check if user credentials are valid
export const authenticateUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  
  if (user) {
    // Store user in localStorage (excluding password)
    const { password: _, ...userInfo } = user;
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    return { success: true, user: userInfo };
  }
  
  return { success: false, message: 'Invalid username or password' };
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('currentUser') !== null;
};

// Get current user info
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};