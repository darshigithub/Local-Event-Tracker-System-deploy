// src/api.js
const API_URL = "http://localhost:5000/api";

// ----------------- Token Helpers -----------------
export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const saveTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
};

// Clear all user data and tokens
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("profile_pic");
  window.location.href = "/login"; // force redirect to login
};

// ----------------- Refresh Access Token -----------------
export const refreshAccessToken = async () => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  try {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refresh_token}`
      }
    });
    const data = await res.json();

    if (res.ok && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } else {
      // Refresh token invalid or expired
      logoutUser();
      return null;
    }
  } catch (err) {
    console.error("Refresh token failed:", err);
    logoutUser();
    return null;
  }
};

// ----------------- Fetch Wrapper with Auth -----------------
export const fetchWithAuth = async (url, options = {}) => {
  let access_token = getAccessToken();

  options.headers = options.headers || {};
  options.headers["Authorization"] = `Bearer ${access_token}`;
  options.headers["Content-Type"] = "application/json";

  let res = await fetch(url, options);
  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  // If access token expired, try refreshing
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      options.headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, options);
      try {
        data = await res.json();
      } catch {
        data = {};
      }
    } else {
      return { ok: false, status: 401, data: { message: "Session expired. Please login again." } };
    }
  }

  return { ok: res.ok, status: res.status, data };
};
