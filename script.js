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

// ------------------------------
// Save & Load
// ------------------------------

function saveBalance() {
    localStorage.setItem("homecoinBalance", balance);
}

function loadBalance() {

    const saved = localStorage.getItem("homecoinBalance");

    if (saved !== null) {
        balance = Number(saved);
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