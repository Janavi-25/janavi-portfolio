import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        // Login successful
        window.location.href = "admin.html";

    } catch (error) {
        alert("Invalid Email or Password");
        console.error(error);
    }
});
