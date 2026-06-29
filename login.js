import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firestoreService.js";

console.log("Login.js Loaded");
console.log("Auth Object:", auth);

// =========================
// LOGIN
// =========================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("✅ Login Successful");

    window.location.href = "admin.html";

  } catch (error) {
    console.error("Login Error:", error);

    alert(error.message);
  }
});

// =========================
// FORGOT PASSWORD
// =========================
const forgotBtn = document.getElementById("forgotPassword");

forgotBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {

    await sendPasswordResetEmail(
      auth,
      "janaviparmar253@gmail.com"
    );

    alert("Password reset email has been sent to:\n\njanaviparmar253@gmail.com");

  } catch (error) {

    console.error("Reset Error:", error);

    alert(error.message);

  }
});
