import { signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { auth, logedIn, logOut, checkUser} from "./utility.js";



addEventListener("DOMContentLoaded", checkUser);// check user at content load and hide or visible elements
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout

document.getElementById("loginBtn").addEventListener("click", function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Log In Successfully 🤝");
            // const user = userCredential.user;
            console.log(userCredential.user.uid);
            console.log(logedIn);
            location.replace("./index.html");
        })
        .catch((error) => {
            alert("Please Enter Correct User Name And Password 🤨");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    
});// when user click on logedIn authenticate user



