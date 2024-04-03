import { db, auth, logOut, checkUser } from "./utility.js";
import { collection, query, where, getCountFromServer} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", checkUser);
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout
async function statusCount(){
    const Ref = collection(db, `User/${auth.currentUser.email}/Files`); //query refrence for search pending Files
    let pendingQuery = query(Ref, where("Status", "==", "Pending"));
    
    const pendingCountData = await getCountFromServer(pendingQuery); // query count which is helpfull to create element 
    console.log(pendingCountData.data().count);
    let pendingCount = pendingCountData.data().count;
    
    let completeQuery = query(Ref, where("Status", "in", ["Approved", "Rejected"]));
    const completeCountData = await getCountFromServer(completeQuery); // query count which is helpfull to create element
    console.log(completeCountData.data().count);
    let completeCount = completeCountData.data().count;

    document.getElementsByClassName("circle")[0].innerHTML = pendingCount;
    document.getElementsByClassName("circle")[0].style.color = "#FDC749";
    document.getElementsByClassName("circle")[1].innerHTML = completeCount;
}
setTimeout(statusCount, 2000);

document.getElementById("trackingBtn").addEventListener("click", function(){

    localStorage.setItem("trackingId", document.getElementById("trackFile").value);
    location.replace("./trackFile.html");
})
function clicked()
{
    console.log("Pending Div Clicked");
    location.replace("./workStatus.html");
}
document.getElementsByClassName("clickedPpending")[0].addEventListener("click", clicked)
document.getElementsByClassName("clickedCompleted")[0].addEventListener("click", clicked)
