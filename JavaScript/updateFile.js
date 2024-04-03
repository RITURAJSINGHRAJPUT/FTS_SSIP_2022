import { auth, db, logOut, checkUser } from "./utility.js";
import { doc, getDoc, setDoc, collection, getCountFromServer, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", checkUser);
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout

let dynamicList = {
    "Account" : ["Account"],
    "CNCD" : ["CNCD"],
    "ICT" : ["ICT"],
    "Engineering" : ["Civil","Electrical", "Mechanical", "Town Planning"],
    "Fire&Emergency" : ["Fire&Emergency"],
    "Food Safety" : ["Food Safety"],
    "Health" : ["Mamta Seva Protsahak Yojna","Birth And Dath Registration","Marriage Registration","Mission Mangalam"],
    "Revenue" : ["Vehicle Tax","Property Tax","Professional Tax"],
    "Sanitation" : ["Notification"],
    "Store Department" : ["Store Department"],
    "Solid Waste Department" : ["Solid Waste Department"]

}

document.getElementById("fwdDepartment").addEventListener("change", function () {
    let departments = document.getElementById("fwdDepartment").value;
    console.log(departments);
    console.log("Function Work");
    let value = departments;
    let listId
    if (value.length == 0) {
        document.getElementById("fwdSubDepartment").innerHTML = `<option value="${value}">${value}</option>`
    } else {
        let dynamicListOption = "";
        dynamicListOption = `<option value="" disabled selected>--Select Sub Department--</option>`
        for (listId in dynamicList[value]) {
            dynamicListOption += `<option value="${dynamicList[value][listId]}"> ${dynamicList[value][listId]} </option>`
        }
        document.getElementById("fwdSubDepartment").innerHTML = dynamicListOption;
    }
})

let departmentUserList = {
    "Account" : ["Employee 1"],
    "CNCD" : ["Employee 2"],
    "ICT" : ["Employee 3"],
    "Civil": ["Manan"],
    "Electrical": ["Rituraj"],
    "Electrical": ["Meet"],
    "Mechanical" : ["Employee 4"],
    "Town Planning" : ["Employee 5"],
    "Fire&Emergency" : ["Employee 6"],
    "Food Safety" : ["Employee 7"],
    "Mamta Seva Protsahak Yojna" : ["Employee 8"],
    "Birth And Dath Registration" : ["Employee 9"],
    "Marriage Registration" : ["Employee 10"],
    "Mission Mangalam" : ["Employee 11"],
    "Professional Tax" : ["Aayush"],
    "Property Tax" : ["Sujal"],
    "Vehicle Tax" : ["Employee 12"],
    "Notification" : ["Employee 13"],
    "Store Department" : ["Employee 14"],
    "Solid Waste Department" : ["Employee 15"]
}
document.getElementById("fwdSubDepartment").addEventListener("change", function () {
    let sub_Departments = document.getElementById("fwdSubDepartment").value;
    console.log(sub_Departments);
    console.log("Appropriate employee according to subdepartment Function Work");
    let value = sub_Departments;
    let userListId
    if (value.length == 0) {
        document.getElementById("fwdOfficerName").innerHTML = `<option value="${value}">${value}</option>`
    } else {
        let dynamicListOption = "";
        dynamicListOption = `<option value="" disabled selected>--Select Sub Department--</option>`
        for (userListId in departmentUserList[value]) {
            dynamicListOption += `<option value="${departmentUserList[value][userListId]}"> ${departmentUserList[value][userListId]} </option>`
        }
        document.getElementById("fwdOfficerName").innerHTML = dynamicListOption;
    }

})

document.getElementById("status").addEventListener("change", function () {

    if (document.getElementById("status").value == "Approved") {
        console.log("Reason Field Hide, Condition True");
        document.getElementsByClassName("approved")[0].classList.add("displaynone");
        document.getElementsByClassName("forwardTo")[0].classList.add("displaynone");

    } else if (document.getElementById("status").value == "Rejected") {
        document.getElementsByClassName("forwardTo")[0].classList.add("displaynone");

    } else {
        document.getElementsByClassName("forwardTo")[0].classList.remove("displaynone");
        document.getElementsByClassName("approved")[0].classList.remove("displaynone");
    }

}); // input field reason hide when file approved  

let trackingId, ownerName, ownerEmail, ownerNo, subject, color, totalPages, description, status;
let today = new Date();
async function fetchData() {

    trackingId = document.getElementById("trackFile").value;
    console.log("Tracking Id From Fetch Function", trackingId);
    const docRef = doc(db, "All_Files", trackingId);
    const docSnap = await getDoc(docRef);

    const update_Count = collection(db, `All_Files/${trackingId}/Updates`);
    const update_Count_fileSnapShot = await getCountFromServer(update_Count);
    console.log(update_Count_fileSnapShot.data().count);
    const updateStatusRef = doc(db, `All_Files/${trackingId}/Updates/Update ${update_Count_fileSnapShot.data().count}`);
    const statusDocSnap = await getDoc(updateStatusRef);
    console.log(statusDocSnap.data().Status);

    if (statusDocSnap.data().Status == "Pending" || statusDocSnap.data().Status == "Generated") {

        if (docSnap.exists()) {

            console.log("Document Data : ", docSnap.data());
            ownerNo = document.getElementById("ownerNo").defaultValue = docSnap.data().Owner_No;
            document.getElementById("ownerNo").style.color = "#7C7C7C";
            document.getElementById("ownerNo").readOnly = "true"; // privent  from changes to set read only

            ownerEmail = document.getElementById("ownerEmail").defaultValue = docSnap.data().Owner_Email;
            document.getElementById("ownerEmail").style.color = "#7C7C7C";
            document.getElementById("ownerEmail").readOnly = "true"; // privent  from changes to set read only

            subject = document.getElementById("subject").defaultValue = docSnap.data().Subject;
            document.getElementById("subject").style.color = "#7C7C7C";
            document.getElementById("subject").readOnly = "true"; // privent  from changes to set read only

            color = document.getElementById("color").defaultValue = docSnap.data().Colour;
            document.getElementById("color").style.color = "#7C7C7C";
            document.getElementById("color").readOnly = "true"; // privent  from changes to set read only

            totalPages = document.getElementById("totalPages").defaultValue = docSnap.data().Total_Pages;
            document.getElementById("totalPages").style.color = "#7C7C7C";
            document.getElementById("totalPages").readOnly = "true"; // privent  from changes to set read only

            ownerName = document.getElementById("ownerName").defaultValue = docSnap.data().Owner_Name;
            document.getElementById("ownerName").style.color = "#7C7C7C";
            document.getElementById("ownerName").readOnly = "true"; // privent  from changes to set read only

            description = document.getElementById("description").defaultValue = docSnap.data().description;
            document.getElementById("description").style.color = "#7C7C7C";
            document.getElementById("description").readOnly = "true"; // privent  from changes to set read only

            // get current time and set by default to the field
            document.getElementById("date").defaultValue = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
            document.getElementById("date").style.color = "#7C7C7C";
            document.getElementById("date").readOnly = "true"; // privent  from changes to set read only

            document.getElementById("time").defaultValue = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            document.getElementById("time").style.color = "#7C7C7C";
            document.getElementById("time").readOnly = "true"; // privent  from changes to set read only

        } else {
            console.log("Document Not Found");
        }
    } else {
        alert("File Already Proccessed");
    }

    // default set checked By Field
    const userRef = doc(db, "User", auth.currentUser.email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        console.log("Document data:", userSnap.data());
        document.getElementById("department").value = userSnap.data().Department;
        document.getElementById("department").disabled = true;
        document.getElementById("subDepartment").value = userSnap.data().Sub_Department;
        document.getElementById("subDepartment").disabled = true;
        document.getElementById("officerName").value = userSnap.data().Name;
        document.getElementById("officerName").disabled = true;
    }
}

document.getElementById("fetchData").addEventListener("click", fetchData); // featch default or priviously added data and show in input field 

async function updateFile() {

    ownerName = document.getElementById("ownerName").value;
    console.log("Owner Name Is : ", ownerName);
    let department = document.getElementById("department").value;
    let subDepartment = document.getElementById("subDepartment").value;
    let officerName = document.getElementById("officerName").value;
    let reason = document.getElementById("reason").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    status = document.getElementById("status").value;
    let fwdDepartment = document.getElementById("fwdDepartment").value;
    let fwdSubDepartment = document.getElementById("fwdSubDepartment").value;
    let fwdOfficerName = document.getElementById("fwdOfficerName").value;
    let fwdThrough = document.getElementById("fwdThrough").value;

    let path = `User/${auth.currentUser.email}/Files`;
    console.log(path);// sub collection path 

    trackingId = document.getElementById("trackFile").value;
    setDoc(doc(db, path, trackingId), {
        Department: department,
        Sub_Department: subDepartment,
        Owner_Name: ownerName,
        Officer_Name: officerName,
        Status: status,
        Date: date,
        Time: time,
        Reason: reason,
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough
    });

    alert("File Updated Successfully at User Account");

    const fileColl = collection(db, `All_Files/${trackingId}/Updates`);
    const fileSnapShot = await getCountFromServer(fileColl);
    console.log(fileSnapShot);
    console.log("Updates File Count From Database : ", fileSnapShot.data().count);
    let updateCount = "Update " + (fileSnapShot.data().count + 1); // File Count Increment, get current File Count For All_Files
    console.log("Update Count", updateCount);

    setDoc(doc(db, `All_Files/${trackingId}/Updates`, updateCount), {
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        Status: status,
        Reason: reason,
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough
    }); // each update versions store 
    alert("Data Updated Successfully 💾")

    const citiesRef = collection(db, "User"); //query refrence for search forword officer email
    const q = query(citiesRef, where("Name", "==", fwdOfficerName));
    console.log(q);
    const querySnapshot = await getDocs(q);
    let sendEmail;
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        sendEmail = doc.data().Email;
    });
    console.log("Sending File Email Is : ", sendEmail);
    setDoc(doc(db, `User/${sendEmail}/Files`, trackingId), {
        Owner_Name: ownerName,
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        Status: status,
        Reason: reason,
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough
    }) // send data on fwd officer Files Data Base
    console.log("File Forward ⏩ TO The Forward Department 🏛️ Successfully ");

    setDoc(doc(db, `allUser/+91${ownerNo}/allFile`, trackingId), {
        fileStatus: status,
        lastUpdateDate: date,
        lastUpdateTime: time,
        lastUpdateReason: reason,
        currentDepartment: fwdDepartment,
        currentSubDepartment: fwdSubDepartment,
    }, { merge: true });// for application

    const fileCollapp = collection(db, `All_Files/${trackingId}/Updates`);
    const fileSnapShotapp = await getCountFromServer(fileCollapp);
    let updateCountapp = "Update " + (fileSnapShotapp.data().count + 1); // File Count Increment, get current File Count For All_Files
    console.log("Update Count", updateCountapp);
    
    setDoc(doc(db, `allUser/+91${ownerNo}/notification`, updateCountapp), {
        TrackingId : trackingId,
        fileStatus: status,
        lastUpdateDate: date,
        lastUpdateTime: time
    }); // for application
}
document.getElementById("updateFileBtn").addEventListener("click", updateFile);
