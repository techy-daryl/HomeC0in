// ==============================
// HomeC0in v1.0
// ==============================

// Current balance
let balance = 0;

// HTML elements
const balanceText = document.getElementById("balance");

const homePage = document.getElementById("homePage");
const earnPage = document.getElementById("earnPage");
const expensePage = document.getElementById("expensePage");
const parentPage = document.getElementById("parentPage");

const earnBtn = document.getElementById("earnBtn");
const expenseBtn = document.getElementById("expenseBtn");
const parentBtn = document.getElementById("parentBtn");

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

    const snap = await getDoc(doc(db, "homecoin", "balance"));

    if (snap.exists()) {
        balance = snap.data().coins;
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

function addCoins(amount) {

    balance += amount;

    updateBalance();

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

// ------------------------------
// Start
// ------------------------------

loadBalance();
window.addCoins = addCoins;