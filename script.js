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

//-------------------------------

import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc
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

// ------------------------------
// Start
// ------------------------------

loadBalance();
window.addCoins = addCoins;