// Global variables to store auth token and logged-in user information
let authIdToken = null;
let loggedInUser = null;

// Redirects to the login page
const redirectToLoginPage = () => {
  const loginPageUrl = 'https://takoyaki3-auth.web.app';
  window.location.href = `${loginPageUrl}?r=${encodeURIComponent(window.location.href)}`;
};

// Decodes JWT
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error occurred during JWT decoding:', e);
    return null;
  }
};

// Checks if the JWT is expired
const isJwtExpired = (decodedToken) => {
  const currentTime = Math.floor(Date.now() / 1000); // Get current time as Unix timestamp
  return decodedToken.exp < currentTime;
};

// Saves JWT to Local Storage
const saveJwtToLocalStorage = (jwt) => {
  window.localStorage.setItem('authIdToken', jwt);
};

// Removes JWT from URL Query Parameters
const removeJwtFromUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('jwt');
  window.history.replaceState({}, document.title, url.toString());
};

// Initializes authentication process
const initializeAuth = () => {
  const queryParams = new URLSearchParams(window.location.search);
  authIdToken = queryParams.get('jwt');

  if (!authIdToken) {
    // Check if JWT exists in Local Storage
    authIdToken = window.localStorage.getItem('authIdToken');
    if (!storedJwt) {
      redirectToLoginPage();
      return; // Stop execution if no token is found
    }
  }
  const decodedToken = decodeJwt(authIdToken);
  if (!decodedToken || isJwtExpired(decodedToken)) {
    console.error('Authentication token is invalid or has expired.');
    redirectToLoginPage();
    return; // Stop execution if token is invalid or expired
  }

  loggedInUser = { email: decodedToken.email }; // Use email as user identifier

  // Save JWT to Local Storage
  saveJwtToLocalStorage(authIdToken);
  removeJwtFromUrl();

  // Proceed with user logged-in state
  console.log('User is authenticated');
};

initializeAuth();
