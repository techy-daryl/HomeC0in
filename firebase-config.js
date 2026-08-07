import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsOe8-AhPYcyO4Ap8nQzmuzqg8iaL9MBg",
  authDomain: "home-c0in.firebaseapp.com",
  projectId: "home-c0in",
  storageBucket: "home-c0in.firebasestorage.app",
  messagingSenderId: "342375231574",
  appId: "1:342375231574:web:d5a588b1b8ac7f9cfc4bf7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };