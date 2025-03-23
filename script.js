let userData = JSON.parse(localStorage.getItem("userData")) || {};
let clicks = 0;
let currentUsername = "";
let isLoggedIn = false;

// Generate a Special Key
function generateSpecialKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Show the Create Account Form
function showCreateAccount() {
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("create-account-container").classList.remove("hidden");
}

// Show the Login Form
function showLogin() {
  document.getElementById("create-account-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
}

// Create Account
function createAccount() {
  const username = document.getElementById("new-username").value.trim();
  if (!username || username.length > 18 || userData[username]) {
    document.getElementById("account-error-message").classList.remove("hidden");
    return;
  }

  const specialKey = generateSpecialKey();
  userData[username] = { specialKey, clicks: 0 };

  localStorage.setItem("userData", JSON.stringify(userData));

  currentUsername = username;
  isLoggedIn = true;
  clicks = 0;

  document.getElementById("create-account-container").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("player-name-display").innerText = username;
  document.getElementById("special-key-value").innerText = specialKey;

  updateLeaderboard();
}

// Login
function login() {
  const specialKey = document.getElementById("login-special-key").value.trim();
  let foundUser = Object.keys(userData).find(user => userData[user].specialKey === specialKey);

  if (foundUser) {
    currentUsername = foundUser;
    isLoggedIn = true;
    clicks = userData[foundUser].clicks;

    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("player-name-display").innerText = currentUsername;
    document.getElementById("special-key-container").style.display = "none";

    updateLeaderboard();
  } else {
    document.getElementById("login-error-message").classList.remove("hidden");
  }
}

// Add Clicks
function addClick() {
  if (!isLoggedIn) return;

  clicks++;
  userData[currentUsername].clicks = clicks;
  localStorage.setItem("userData", JSON.stringify(userData));

  document.getElementById("click-count").innerText = clicks;
  updateLeaderboard();
}

// Update Leaderboard
function updateLeaderboard() {
  const leaderboardContainer = document.getElementById("leaderboard-container");
  leaderboardContainer.innerHTML = "";

  const sortedUsers = Object.keys(userData).map(username => ({
    username,
    clicks: userData[username].clicks
  })).sort((a, b) => b.clicks - a.clicks);

  sortedUsers.slice(0, 10).forEach(user => {
    const div = document.createElement("div");
    div.innerText = `${user.username}: ${user.clicks} clicks`;
    leaderboardContainer.appendChild(div);
  });
}

// Copy Special Key
function copyKey() {
  const specialKey = document.getElementById("special-key-value").innerText;
  navigator.clipboard.writeText(specialKey);
  alert("Special Key copied!");
}
