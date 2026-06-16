import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

document.getElementById("loginBtn").addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "admin.html";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});
