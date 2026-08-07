// ==============================
// HomeC0in v1.0
// ==============================

// Current balance
let balance = 0;
// history
let history = [];
// parent pin
let parentPin = 1111;
// first setup
let firstSetup = true;
// requests's temporary array
let requests = [];

// HTML elements
const balanceText = document.getElementById("balance");

const homePage = document.getElementById("homePage");
const earnPage = document.getElementById("earnPage");
const expensePage = document.getElementById("expensePage");
const parentPage = document.getElementById("parentPage");

const earnBtn = document.getElementById("earnBtn");
const expenseBtn = document.getElementById("expenseBtn");
const parentBtn = document.getElementById("parentBtn");
const historyBtn = document.getElementById("historyBtn");
const historyPage = document.getElementById("historyPage");
const historyList = document.getElementById("historyList");

const pinInput = document.getElementById("pin");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const loginSection = document.getElementById("loginSection");
const setupSection = document.getElementById("setupSection");
const parentDashboard = document.getElementById("parentDashboard");

const newPinInput = document.getElementById("newPin");
const confirmPinInput = document.getElementById("confirmPin");
const savePinBtn = document.getElementById("savePinBtn");
const setupMessage = document.getElementById("setupMessage");

const logoutBtn = document.getElementById("logoutBtn");
const resetBalanceBtn = document.getElementById("resetBalanceBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const requestsBtn = document.getElementById("requestsBtn");
const requestsPage = document.getElementById("requestsPage");
const requestsList = document.getElementById("requestsList");

const requestTask = document.getElementById("requestTask");
const requestReward = document.getElementById("requestReward");
const createRequestBtn = document.getElementById("createRequestBtn");

//-------------------------------

import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

//-------------------------------

// ------------------------------
// Save & Load
// ------------------------------

async function saveBalance() {

    await setDoc(doc(db, "homecoin", "balance"), {
        coins: balance
    });

}

async function loadBalance() {

    // Load balance
    const balanceSnap = await getDoc(doc(db, "homecoin", "balance"));

    if (balanceSnap.exists()) {
        balance = balanceSnap.data().coins;
    }

    // Load settings
    const settingsSnap = await getDoc(doc(db, "homecoin", "settings"));

    if (settingsSnap.exists()) {

        parentPin = settingsSnap.data().parentPin;
        firstSetup = settingsSnap.data().firstSetup;

    }

    updateBalance();

}

// ------------------------------
// Balance
// ------------------------------

function updateBalance() {

    balanceText.innerHTML = balance + " HC";

    saveBalance();

}

// ------- requests --------->

function updateRequests() {

    requestsList.innerHTML = "";

    if (requests.length === 0) {

        requestsList.innerHTML = "<p>No requests yet.</p>";
        return;

    }

    requests.forEach((request, index) => {

        let buttonHTML = "";

        if (request.status === "New") {

            buttonHTML = `
                <button onclick="acceptRequest(${index})">
                    Accept
                </button>
            `;

        } else {

            buttonHTML = `
                <p>✅ Accepted</p>
            `;

        }

        requestsList.innerHTML += `
            <div class="request-card">

                <h3>${request.task}</h3>

                <p><b>${request.reward} HC</b></p>

                <p>Status: ${request.status}</p>

                ${buttonHTML}

            </div>
        `;

    });

}

function addCoins(amount, task = "Unknown Task") {

    balance += amount;

    history.unshift({

        amount: amount,
        task: task,
        time: new Date().toLocaleString()

    });

    updateHistory();

    updateBalance();

}

function updateHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML = "No history yet.";

        return;

    }

    history.forEach(item => {

        const div = document.createElement("div");

        div.innerHTML =
        `<b>${item.amount > 0 ? "+" : ""}${item.amount} HC</b><br>
        ${item.task}<br>
        <small>${item.time}</small><hr>`;

        historyList.appendChild(div);

    });

}

// ------------------------------
// Pages
// ------------------------------

function hidePages() {

    homePage.classList.add("hidden");
    earnPage.classList.add("hidden");
    expensePage.classList.add("hidden");
    parentPage.classList.add("hidden");
    requestsPage.classList.add("hidden");
}

earnBtn.onclick = function () {

    hidePages();

    earnPage.classList.remove("hidden");

};

expenseBtn.onclick = function () {

    hidePages();

    expensePage.classList.remove("hidden");

};

parentBtn.onclick = function () {

    hidePages();

    parentPage.classList.remove("hidden");

};

historyBtn.onclick = function () {

    hidePages();

    historyPage.classList.remove("hidden");

};

requestsBtn.onclick = function () {

    hidePages();

    requestsPage.classList.remove("hidden");

};

resetBalanceBtn.onclick = async function () {

    balance = 0;

    updateBalance();

};

clearHistoryBtn.onclick = function () {

    history = [];

    updateHistory();

};

logoutBtn.onclick = function () {

    parentDashboard.classList.add("hidden");

    loginSection.classList.remove("hidden");

    pinInput.value = "";

    loginMessage.textContent = "";

};

createRequestBtn.onclick = function () {

    const task = requestTask.value.trim();
    const reward = Number(requestReward.value);

    if (task === "" || reward <= 0) {
        alert("Please enter a valid task and reward.");
        return;
    }

    requests.push({
        task,
        reward,
        status: "New"
    });

    updateRequests();

    requestTask.value = "";
    requestReward.value = "";

};

function acceptRequest(index) {

    requests[index].status = "Accepted";

    alert("Request accepted!");

    updateRequests();

}

// ------------------------------
// Start
// ------------------------------

savePinBtn.onclick = async function () {

    const newPin = Number(newPinInput.value);
    const confirmPin = Number(confirmPinInput.value);

    if (newPin !== confirmPin) {
        setupMessage.textContent = "❌ PINs do not match.";
        return;
    }

    if (newPin < 1000 || newPin > 9999) {
        setupMessage.textContent = "❌ PIN must be exactly 4 digits.";
        return;
    }

    try {

        await setDoc(
            doc(db, "homecoin", "settings"),
            {
                parentPin: newPin,
                firstSetup: false
            },
            { merge: true }
        );

        parentPin = newPin;
        firstSetup = false;

        setupMessage.textContent = "✅ PIN saved successfully!";

        setupSection.classList.add("hidden");
        parentDashboard.classList.remove("hidden");

    } catch (error) {

        console.error(error);

        setupMessage.textContent =
            error.code + "\n" + error.message;

    }

};

loginBtn.onclick = async function () {

    // Always get the latest settings from Firestore
    const settingsSnap = await getDoc(doc(db, "homecoin", "settings"));

    if (settingsSnap.exists()) {
        parentPin = settingsSnap.data().parentPin;
        firstSetup = settingsSnap.data().firstSetup;
    } else {
        loginMessage.textContent = "❌ Settings document not found.";
        return;
    }

    const enteredPin = Number(pinInput.value);

    if (enteredPin !== parentPin) {
        loginMessage.textContent = "❌ Incorrect PIN";
        return;
    }

    loginMessage.textContent = "";

    loginSection.classList.add("hidden");

    if (firstSetup) {
        setupSection.classList.remove("hidden");
    } else {
        parentDashboard.classList.remove("hidden");
    }

};

loadBalance();

window.addCoins = addCoins;
window.acceptRequest = acceptRequest;