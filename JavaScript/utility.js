import * as firebase from "./Firebase/firebase.js"; 
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
const auth = getAuth(firebase.app);
const db = getFirestore(firebase.app);
let logedIn;




function logOut() {
    signOut(auth).then(()=>{
        alert("Sign Out Successfully ✅");
        location.replace("./login.html");
    }).catch((error)=>{
        const errorMessage = error.message;
        console.log(errorMessage);
    })
} // logout user


function checkUser() {
    console.log("Check User");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            logedIn = true;
            hidden();
            userName();
            let userEmail = user.email;
            console.log("User Email Is " + userEmail)
            console.log("User Find UID" + user.uid);
        } else {
            logedIn = false;
            hidden();
            console.log("User Not Found");
        }
    });
} // check use is loged in or not

async function userName ()
{
    let USERNAME;
    const docRef = doc(db, "User",auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        USERNAME = docSnap.data();// add direct username
        document.getElementsByClassName("USERNAME")[0].innerHTML = USERNAME.Name; // [Improve : Style Color Not Applied Solved By provide Class To the a]
        console.log(USERNAME.Name);
        console.log(auth.currentUser.email);
    }else
    {
        console.log("Document Not Found");
    }
}// print user Name

function hidden() {
    let totalHide = document.querySelectorAll(".hide").length;
    console.log("Total Hide Element Is : ",totalHide);
    if (logedIn == true) {
        console.log(" Hide Condition True");
        for (let i = 0; i < totalHide; i++) {
            document.getElementsByClassName("hide")[i].classList.remove("displaynone");
        }
        document.getElementsByClassName("hide")[2].classList.add("displaynone");
        if(totalHide > 5)
        {
            document.getElementsByClassName("hide")[5].classList.remove("displaynone");
        }
    } else {
        console.log("Hide Condition False");
        for (let i = 0; i < totalHide; i++) {
            document.getElementsByClassName("hide")[i].classList.add("displaynone");
        }
        document.getElementsByClassName("hide")[2].classList.remove("displaynone");
        // document.getElementsByClassName("hide")[5].classList.remove("displaynone");
        if(totalHide > 5)
        {
            document.getElementsByClassName("hide")[5].classList.add("displaynone");
            document.getElementsByClassName("hide")[6].classList.remove("displaynone");
        }
    }
} // run loop count hide time . hide count start from 0
export {auth, db, logedIn, logOut, checkUser, userName};
 
