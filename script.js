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

const shopBtn = document.getElementById("shopBtn");
const shopPage = document.getElementById("shopPage");
const shopList = document.getElementById("shopList");

const requestTask = document.getElementById("requestTask");
const requestReward = document.getElementById("requestReward");
const createRequestBtn = document.getElementById("createRequestBtn");

//-------------------------------

import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    collection,
    getDocs,
    updateDoc,
    serverTimestamp
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

async function loadRequests() {

    requests = [];

    const snapshot = await getDocs(collection(db, "requests"));

    snapshot.forEach((docSnap) => {

        requests.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

    updateRequests();

}

// ------------------------------
// Balance
// ------------------------------

// ------------------------------
// Requests
// ------------------------------

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
                <p>✅ ${request.status}</p>
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

async function acceptRequest(index) {

    const request = requests[index];

    await updateDoc(
        doc(db, "requests", request.id),
        {
            status: "Accepted"
        }
    );

     await loadRequests();

}

function updateBalance() {

    balanceText.textContent = balance + " HC";

    saveBalance();

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
    shopPage.classList.add("hidden");

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

shopBtn.onclick = function () {

    hidePages();

    shopPage.classList.remove("hidden");

    loadShop();

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

createRequestBtn.onclick = async function () {

    const task = requestTask.value.trim();
    const reward = Number(requestReward.value);

    if (task === "" || reward <= 0) {
        alert("Please enter a valid task and reward.");
        return;
    }

    await addDoc(collection(db, "requests"), {

        task: task,
        reward: reward,
        status: "New",
        created: serverTimestamp()

    });

    requestTask.value = "";
    requestReward.value = "";

    loadRequests();

};

// ------------------------------
// Shop
// ------------------------------

async function buyProduct(product) {

    // Check if you have enough HC
    if (balance < product.price) {
        alert("❌ You don't have enough HomeCoins!");
        return;
    }

    // Confirm purchase
    const confirmed = confirm(
        `Buy ${product.name} for ${product.price} HC?`
    );

    if (!confirmed) {
        return;
    }

    // If it's an investment, save ownership
    if (product.type === "investment") {

        const investmentRef = doc(
            db,
            "homecoin",
            "investments"
        );

        const investmentSnap = await getDoc(investmentRef);

        let investments = {};

        if (investmentSnap.exists()) {
            investments = investmentSnap.data();
        }

        // Don't allow buying the same permanent investment twice
        if (
            product.benefit !== "double_money_7d" &&
            investments[product.benefit] === true
        ) {
            alert("⚠️ You already own this investment!");
            return;
        }

        // Double Money gets an expiration date
        if (product.benefit === "double_money_7d") {

            const expiresAt =
                Date.now() + (7 * 24 * 60 * 60 * 1000);

            investments[product.benefit] = expiresAt;

        } else {

            investments[product.benefit] = true;

        }

        await setDoc(
            investmentRef,
            investments,
            { merge: true }
        );
    }

    // Take the HC
    balance -= product.price;

    history.unshift({
        amount: -product.price,
        task: `Bought ${product.name}`,
        time: new Date().toLocaleString()
    });

    updateHistory();
    updateBalance();

    alert(`✅ You bought ${product.name}!`);
}

async function loadShop() {

    shopList.innerHTML = "<p>Loading shop...</p>";

    try {

        const snapshot = await getDocs(collection(db, "shop"));

        shopList.innerHTML = "";

        if (snapshot.empty) {

            shopList.innerHTML = "<p>No products available.</p>";
            return;

        }

        snapshot.forEach((docSnap) => {

            const product = docSnap.data();

            const card = document.createElement("div");

            card.className = "shop-card";

            card.innerHTML = `
                <h3>${product.name}</h3>

                <p>${product.description || ""}</p>

                <p><b>${product.price} HC</b></p>

                <button class="buy-button">
                    Buy
                </button>
            `;

            card.querySelector(".buy-button").onclick = function () {
                buyProduct(product);
            };

            shopList.appendChild(card);

        });

    } catch (error) {

        console.error("Shop error:", error);

        shopList.innerHTML =
            "<p>❌ Could not load shop.</p>";

    }
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
loadRequests();

window.addCoins = addCoins;
window.acceptRequest = acceptRequest;