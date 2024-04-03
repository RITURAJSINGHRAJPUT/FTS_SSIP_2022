import { db, logOut, checkUser} from "./utility.js";
import { doc, getDoc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", checkUser);
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout

let trackingId;

addEventListener("DOMContentLoaded", function(){
    let localStorageTid = localStorage.getItem("trackingId");
    if(localStorageTid != null) // first time login localstorage is null 
    {
        document.getElementById("trackingId").defaultValue = localStorageTid;
        document.getElementById("trackBtn").click();
    }
})// user redirect from index.html #tracfile with id then use stored id and clicked nutton

async function fetchData() {
    trackingId = document.getElementById("trackingId").value;
    console.log("Tracking Id :", trackingId);
    const trackRef = doc(db, `All_Files/${trackingId}/Updates/Update 1`); // refrence for Added Data
    const trackSnap = await getDoc(trackRef);
    
    const updateCountRef = collection(db, `All_Files/${trackingId}/Updates`);// reference for updated data
    const fileSnapShot = await getCountFromServer(updateCountRef);
    const updated = doc(db, `All_Files/${trackingId}/Updates/Update ${fileSnapShot.data().count}`);
    const updatedSnap = await getDoc(updated)
    // console.log("Last Update Version : ", updatedSnap.data().Time);

    if (trackSnap.exists()) {
        console.log("Log From Update One",trackSnap.data());
        console.log("Log From Last Update",updatedSnap.data());
        document.getElementById("description").innerHTML = `Title : ${trackSnap.data().Subject}`;
        document.getElementById("color").innerHTML = `Colour : ${trackSnap.data().Colour}`;
        document.getElementById("totalPages").innerHTML = `Pages : ${trackSnap.data().Total_Pages}`;
        document.getElementById("Reason").innerHTML = `Reason : ${trackSnap.data().description}`;

        document.getElementById("status").innerHTML = `Status : ${updatedSnap.data().Status}`;
        document.getElementById("department").innerHTML = `Department : ${updatedSnap.data().Department}`;
        document.getElementById("subDepartment").innerHTML = `Sub Department : ${updatedSnap.data().Sub_Department}`;
        document.getElementById("date").innerHTML = `Date of Update : ${updatedSnap.data().Date}`;
        document.getElementById("time").innerHTML = `Time of Update: ${updatedSnap.data().Time}`;
        document.getElementById("updatedBy").innerHTML = `Updated By : ${updatedSnap.data().Officer_Name}`;
        document.getElementById("reason").innerHTML = `Reason(Pending/Rejected) : ${updatedSnap.data().Reason}`; // check 

        document.getElementById("ownerName").innerHTML = `Name : ${trackSnap.data().Owner_Name}`;
        document.getElementById("ownerNo").innerHTML = `Mobile No : ${trackSnap.data().Owner_No}`;
        document.getElementById("ownerEmail").innerHTML = `Email : ${trackSnap.data().Owner_Email}`;
    }else
    {
        alert("File Does Not Found ❌");
    }
}

async function animation() {
    console.log("Tracking Id Animation Function :",trackingId);
    //count documents in Updates
    const updateCount = collection(db, `All_Files/${trackingId}/Updates`);
    const fileSnapShot = await getCountFromServer(updateCount);
    console.log("Updates File Count From Database : ", fileSnapShot.data().count);
    let totalUpdate = fileSnapShot.data().count;
    let lastFourDate = [];
    let lastFourTime = [];
    let latStatus = [];
    for (let i = totalUpdate; i > totalUpdate - 4; i--) {
        console.log(i);
        const updateDocRef = doc(db, `All_Files/${trackingId}/Updates/Update ${i}`);
        const updateDocSnap = await getDoc(updateDocRef);
        if(updateDocSnap.exists())
        {
            console.log(updateDocSnap.data().Date);
            lastFourDate.push(updateDocSnap.data().Date);
            lastFourTime.push(updateDocSnap.data().Time);
            latStatus.push(updateDocSnap.data().Status);
        }else
        {
            break;
        }
            
    }//fetch last four date and store in array
    console.log(lastFourDate);
    for (let i = 0; i < lastFourDate.length; i++) {
        console.log("Animation Loop", i);
        const updateDocRef = doc(db, `All_Files/${trackingId}/Updates/Update ${i}`);
        const updateDocSnap = await getDoc(updateDocRef);
        document.getElementById(`check${i + 1}`).checked = true;
        document.getElementById(`date${i + 1}`).innerHTML = lastFourDate[lastFourDate.length-(i+1)];
        document.getElementById(`time${i + 1}`).innerHTML = lastFourTime[lastFourTime.length-(i+1)];
        document.getElementById(`status${i + 1}`).innerHTML = latStatus[latStatus.length-(i+1)];
        if (document.getElementById(`check${i + 1}`).checked == true) {
            let fillpath = (i + 1) * 200 + "px";// animation update Each Time
            document.getElementsByClassName("line")[0].style.width = fillpath;
        }
    } // print fetch dates and update animation path by 200pc each point
}

document.getElementById("trackBtn").addEventListener("click", fetchData);// featch and show data
document.getElementById("trackBtn").addEventListener("click", animation);// featch and show data

