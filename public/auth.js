let authIdToken = null;
let loggedInUser = null;

// Initializes authentication
const initializeAuth = () => {
  const queryParams = new URLSearchParams(window.location.search);
  authIdToken = queryParams.get('jwt');

  if (!authIdToken) {
    redirectToLoginPage();
  } else {
    const decodedToken = decodeJwt(authIdToken);
    if (decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time as Unix timestamp
      if (decodedToken.exp < currentTime) {
        // If JWT has expired
        console.error('Authentication token has expired.');
        redirectToLoginPage(); // Redirect to login page
        return; // Stop further execution
      }

      loggedInUser = {
        email: decodedToken.email, // Use email as user identifier
      };
      // Continue with processes that use the logged-in user's information
    } else {
      // In case of decode failure or invalid token
      console.error('Failed to decode JWT.');
      redirectToLoginPage(); // Redirect to login page
    }
  }
};

// Decodes JWT
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error occurred during JWT decoding:', e);
    return null;
  }
};

// Redirects to the login page
const redirectToLoginPage = () => {
  window.location.href = 'https://takoyaki3-auth.web.app?r=' + window.location.href;
};

initializeAuth();
