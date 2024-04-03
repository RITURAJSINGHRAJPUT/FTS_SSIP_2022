import { auth, db, logOut, checkUser } from "./utility.js";
import { collection, query, where, getDocs, getCountFromServer} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", checkUser);
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout

let pendingCount, completeCount;
function createElement(ele, fileStatus)
{

    let div = document.createElement("div");
    div.setAttribute("class", "File")
    div.style.margin = "10px 0px 0px 0px"
    div.style.gridColumnStart = "1";
    div.style.gridColumnEnd = "3";
    div.style.height = "50px";
    div.style.border = "2px solid #808080";
    div.style.borderRadius = "5px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.position = "relative";
    document.getElementsByClassName(fileStatus)[0].appendChild(div);
    
        
    let p1 = document.createElement("p");
    p1.setAttribute("class", "id")
    p1.style.fontWeight = "600";
    document.getElementsByClassName("File")[ele].appendChild(p1);
    
    let p2 = document.createElement("p");
    p2.setAttribute("class", "ownerName")
    p2.style.marginLeft = "5px";
    p2.style.fontWeight = "600";
    p2.style.color = "#808080";
    document.getElementsByClassName("File")[ele].appendChild(p2);

    let p3 = document.createElement("p");
    p3.setAttribute("class", "date")
    p3.style.marginLeft = "5px";
    p3.style.fontWeight = "600";
    p3.style.color = "#000000";
    document.getElementsByClassName("File")[ele].appendChild(p3);

    let p4 = document.createElement("p");
    p4.setAttribute("class", "time")
    p4.style.marginLeft = "5px";
    p4.style.fontWeight = "600";
    p4.style.color = "#000000";
    document.getElementsByClassName("File")[ele].appendChild(p4);

    let input = document.createElement("input");
    input.setAttribute("type", "button")
    input.setAttribute("class", "updateBtn")
    input.setAttribute("value", "Track File")
    input.style.height = "100%"
    input.style.width = "150px"
    input.style.outline = "none"
    input.style.cursor = "pointer"
    input.style.border = "none"
    input.style.fontSize = "medium"
    input.style.fontWeight = "600"
    input.style.letterSpacing = "1px"
    input.style.borderRadius = "4px"
    input.style.color = "#ffffff"
    input.style.backgroundColor = "#E94A5C"
    input.style.transition = "background-color 1s ease-in-out"
    input.style.position = "absolute"
    input.style.right = "0"
    document.getElementsByClassName("File")[ele].appendChild(input);

    
}
document.getElementsByClassName("pending")[0].addEventListener("click", async function changeColor() {
    console.log("Pending Div Clicked");
    document.getElementById("pendingRemove").classList.add("pendingFile");
    document.getElementsByClassName("completeFile")[0].classList.add("displaynone");
    document.getElementsByClassName("pendingFile")[0].classList.remove("displaynone");
    document.getElementsByClassName("pending")[0].style.backgroundColor = "#FDC749";
    document.getElementsByClassName("completed")[0].style.color = "#E94A5C";
    document.getElementsByClassName("completed")[0].style.backgroundColor = "#FFFF";
    
    const pendingRef = collection(db, `User/${auth.currentUser.email}/Files`); //query refrence for search pending Files
    const q = query(pendingRef, where("Status", "==", "Pending"));
    const pendingSnapshot = await getDocs(q); // query snapshot
    console.log(q);
    
    const pendingCountData = await getCountFromServer(q); // query count which is helpfull to create element 
    console.log(pendingCountData.data().count);
    let pendingCount = pendingCountData.data().count;
    
    console.log("Use Const TO the Outside of function :", pendingCount);
    document.getElementsByClassName("circle")[0].innerHTML = pendingCount; // count Number print in circle
    document.getElementsByClassName("pending")[0].style.color = "#FFF";
    
    
    let childCount = document.getElementById("pendingRemove").children.length;
    console.log("Element Insisde Pending File : ",childCount);
    for (let i = 0; i < pendingCount; i++) {
        if(childCount >= pendingCount)
        {
            break;
        }else{
            createElement(i, "pendingFile");
        }
    }// create pendingCount element
    document.getElementById("completeRemove").classList.remove("completeFile");
    document.getElementsByClassName("pendingFile")[0].style.gridColumnStart = "1";
    document.getElementsByClassName("pendingFile")[0].style.gridColumnEnd = "3";


    let i = 0;
    pendingSnapshot.forEach((doc) => {
        console.log(i);
        console.log(doc.id, " => ", doc.data());
        console.log("Tracking Id Is :",doc.id);
        console.log("Forworded officer Name Is :",doc.data().FWD_OfficerName);
        document.getElementsByClassName("id")[`${i}`].innerHTML = doc.id;
        document.getElementsByClassName("ownerName")[`${i}`].innerHTML = doc.data().Owner_Name;
        document.getElementsByClassName("time")[`${i}`].innerHTML = "Time : " + doc.data().Time;
        document.getElementsByClassName("date")[`${i}`].innerHTML = "Date : " + doc.data().Date;
        i = i+1;
    });// insert data in created element 
})

document.getElementsByClassName("completed")[0].addEventListener("click",async function changeColor() {
    console.log("Complited Div Clicked");
    document.getElementById("completeRemove").classList.add("completeFile");
    document.getElementsByClassName("completeFile")[0].classList.remove("displaynone");
    document.getElementsByClassName("pendingFile")[0].classList.add("displaynone");
    document.getElementsByClassName("completed")[0].style.backgroundColor = "#E94A5C";
    document.getElementsByClassName("pending")[0].style.color = "#FDC749";
    document.getElementsByClassName("pending")[0].style.backgroundColor = "#FFF";
    
    const completeRef = collection(db, `User/${auth.currentUser.email}/Files`); //query refrence for search pending Files
    const q = query(completeRef, where("Status", "in", ["Approved", "Rejected"]));
    const completeSnapshot = await getDocs(q); // query snapshot
    console.log(q);
    
    const completeCountData = await getCountFromServer(q); // query count which is helpfull to create element
    console.log(completeCountData.data().count);
    completeCount = completeCountData.data().count;
    
    console.log("Use Const TO the Outside of function :", completeCount);
    document.getElementsByClassName("circle")[1].innerHTML = completeCount; // count Number print in circle
    document.getElementsByClassName("completed")[0].style.color = "#FFF";
    
    let childCount = document.getElementById("completeRemove").children.length;
    console.log("Element Insisde Pending File : ",childCount);

    for (let i = 0; i < completeCount; i++) {
        if(childCount >= completeCount)
        {
            break;
        }else
        {
            createElement(i, "completeFile");
        }
    } // create pendingCount element
    document.getElementById("pendingRemove").classList.remove("pendingFile");
    document.getElementsByClassName("completeFile")[0].style.gridColumnStart = "1";
    document.getElementsByClassName("completeFile")[0].style.gridColumnEnd = "3";

    
    let i = 0;
    completeSnapshot.forEach((doc) => {
        console.log(i);
        console.log(doc.id, " => ", doc.data());
        console.log("Tracking Id Is :",doc.id);
        console.log("Forworded officer Name Is :", doc.data().FWD_OfficerName);
        document.getElementsByClassName("id")[`${i}`].innerHTML = doc.id;
        document.getElementsByClassName("ownerName")[`${i}`].innerHTML = doc.data().Owner_Name; 
        document.getElementsByClassName("time")[`${i}`].innerHTML = "Time : " + doc.data().Time;
        document.getElementsByClassName("date")[`${i}`].innerHTML = "Date : " + doc.data().Date;
        i = i+1;
    }); // insert data in created element
}); // when use click appropriate div change color and  show file appropriate file to call showFile Function