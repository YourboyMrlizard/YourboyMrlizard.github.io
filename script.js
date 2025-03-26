let userData = JSON.parse(localStorage.getItem("userData")) || {};
let clicks = 0;
let currentUsername = "";
let isLoggedIn = false;

// BroadcastChannel for syncing across browser tabs
const syncChannel = new BroadcastChannel("clickerGameSync");

// Generate a Special Key
function generateSpecialKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Create Account
function createAccount() {
    const username = document.getElementById("new-username").value.trim();
    if (!username || username.length > 18 || userData[username]) {
        document.getElementById("account-error-message").classList.remove("hidden");
        return;
    }

    // Generate a unique special key
    const specialKey = generateSpecialKey();
    userData[username] = { specialKey, clicks: 0 };

    localStorage.setItem("userData", JSON.stringify(userData));
    syncChannel.postMessage(userData); // Sync with other tabs

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
        document.getElementById("player-name-display").innerText = foundUser;
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
    syncChannel.postMessage(userData); // Sync with other tabs
}

// Update Leaderboard
function updateLeaderboard() {
    const leaderboardContainer = document.getElementById("leaderboard-container");
    const leaderboard = Object.entries(userData)
        .map(([username, data]) => ({ username, clicks: data.clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

    leaderboardContainer.innerHTML = leaderboard.map(entry => 
        `<div class="leaderboard-entry">${entry.username}: ${entry.clicks} clicks</div>`).join("");
}

// Copy Special Key
function copyKey() {
    navigator.clipboard.writeText(userData[currentUsername].specialKey);
}

// Show login page
function loginPage() {
    document.getElementById("create-account-container").classList.add("hidden");
    document.getElementById("login-container").classList.remove("hidden");
}

// Listen for sync messages from other tabs
syncChannel.onmessage = (event) => {
    userData = event.data;
    localStorage.setItem("userData", JSON.stringify(userData));
    updateLeaderboard();
};
