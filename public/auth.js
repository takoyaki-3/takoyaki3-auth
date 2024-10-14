// Global variables to store auth token and logged-in user information
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

// Gets JWT from HttpOnly cookie
const getJwtFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const jwtCookie = cookies.find(row => row.startsWith('authIdToken='));
  return jwtCookie ? jwtCookie.split('=')[1] : null;
};

// Saves JWT to HttpOnly Cookie
const saveJwtToCookie = (jwt) => {
  document.cookie = `authIdToken=${jwt}; Secure; HttpOnly; SameSite=Strict; Max-Age=3600`; // Expires in 1 hour
};

// Clears JWT Cookie on logout
const clearJwtCookie = () => {
  document.cookie = "authIdToken=; Max-Age=0; Secure; HttpOnly; SameSite=Strict;";
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
  let authIdToken = queryParams.get('jwt');

  if (!authIdToken) {
    // Check if JWT exists in HttpOnly Cookie
    authIdToken = getJwtFromCookie();
    if (!authIdToken) {
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

  // Save JWT to HttpOnly Cookie
  saveJwtToCookie(authIdToken);
  removeJwtFromUrl();

  // Proceed with user logged-in state
  console.log('User is authenticated');
};

// Logout function
const signOut = () => {
  firebase.auth().signOut().then(() => {
    clearJwtCookie(); // Clear JWT from Cookie
    console.log('User signed out successfully');
    redirectToLoginPage(); // Redirect to login page after logout
  }).catch((error) => {
    console.error('Error during sign-out:', error);
  });
};

initializeAuth();

