import { auth, db, logOut, checkUser, userName } from "./utility.js";
import { getDoc, setDoc, doc, collection, getCountFromServer, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", checkUser);
document.getElementById("logOut").addEventListener("click", logOut);// logout user when click on Logedout

let today = new Date();
let allFileCount;
let userFileCount;
let trackingId;
let subCollpath;
let subDepartmentDynamicList = {
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

document.getElementById("fwdDepartment").addEventListener("change", function(){
    let departments = document.getElementById("fwdDepartment").value;
    console.log(departments);
    console.log("Function Work");
    let value = departments;
    let listId
    if(value.length==0)
    {
        document.getElementById("fwdSubDepartment").innerHTML = `<option value="${value}">${value}</option>`
    }else
    {
        let dynamicListOption = "";
        dynamicListOption = `<option value="" disabled selected>--Select Sub Department--</option>`
        for(listId in subDepartmentDynamicList[value])
        {
            dynamicListOption += `<option value="${subDepartmentDynamicList[value][listId]}"> ${subDepartmentDynamicList[value][listId]} </option>`
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
document.getElementById("fwdSubDepartment").addEventListener("change", function(){
    let sub_Departments = document.getElementById("fwdSubDepartment").value;
    console.log(sub_Departments);
    console.log("Appropriate employee according to subdepartment Function Work");
    let value = sub_Departments;
    let userListId
    if(value.length==0)
    {
        document.getElementById("fwdOfficerName").innerHTML = `<option value="${value}">${value}</option>`
    }else
    {
        let dynamicListOption = "";
        dynamicListOption = `<option value="" disabled selected>--Select Sub Department--</option>`
        for(userListId in departmentUserList[value])
        {
            dynamicListOption += `<option value="${departmentUserList[value][userListId]}"> ${departmentUserList[value][userListId]} </option>`
        }
        document.getElementById("fwdOfficerName").innerHTML = dynamicListOption;
    }

})

addEventListener("DOMContentLoaded", async function defaultData() {
    console.log("Execute this File Content Loader");
    document.getElementById("date").defaultValue = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    document.getElementById("date").readOnly = "true"; // privent from changes to set read only

    document.getElementById("time").defaultValue = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById("time").readOnly = "true"; // privent from changes to set read only

    //get privious File Count For All_Files
    const allFileColl = collection(db, "All_Files");
    const snapShot = await getCountFromServer(allFileColl);
    console.log("All File Count From Database : ", snapShot.data().count);
    allFileCount = snapShot.data().count + 1; // File Count Increment, get current File Count For All_Files

    //get privious File Count For User_Files
    subCollpath = `User/${auth.currentUser.email}/Files`;
    const userFileColl = collection(db, subCollpath);
    const usersnapShot = await getCountFromServer(userFileColl);
    console.log("User File Count From Database : ", snapShot.data().count);
    userFileCount = snapShot.data().count + 1; // File Count Increment, get current File Count For All_Files

    //Generate Tracking id 
    trackingId = "FTS" + today.getFullYear() + allFileCount;
    console.log("Tracking Id : ", trackingId);
    document.getElementById("trackingId").defaultValue = trackingId; // Set tracking_id by default to the input Field
    document.getElementById("trackingId").readOnly = "true"; // privent tracking id from changes to set read only

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

});


document.getElementById("addFileBtn").addEventListener("click", async function () {
    let ownerName = document.getElementById("ownerName").value;
    let ownerNo = document.getElementById("ownerNo").value;
    let ownerEmail = document.getElementById("ownerEmail").value;
    let subject = document.getElementById("subject").value;
    let color = document.getElementById("color").value;
    let totalPages = document.getElementById("totalPages").value;
    let description = document.getElementById("description").value;
    let department = document.getElementById("department").value;
    let subDepartment = document.getElementById("subDepartment").value;
    let officerName = document.getElementById("officerName").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let fwdDepartment = document.getElementById("fwdDepartment").value;
    let fwdSubDepartment = document.getElementById("fwdSubDepartment").value;
    let fwdOfficerName = document.getElementById("fwdOfficerName").value;
    let fwdThrough = document.getElementById("fwdThrough").value;


    let path = `User/${auth.currentUser.email}/Files`;
    console.log(path);// sub collection path 

    setDoc(doc(db, subCollpath, trackingId), {
        Owner_Name: ownerName,
        Owner_No: ownerNo,
        Owner_Email: ownerEmail,
        Subject: subject,
        Colour: color,
        Total_Pages: totalPages,
        description: description,
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        Status: "Approved",
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough,
        File_Count: userFileCount,
        Tracking_Id: trackingId
    }); // set data to the current user
    setDoc(doc(db, "All_Files", trackingId), {
        Owner_Name: ownerName,
        Owner_No: ownerNo,
        Owner_Email: ownerEmail,
        Subject: subject,
        Colour: color,
        Total_Pages: totalPages,
        description: description,
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough,
        File_Count: allFileCount,
        Tracking_Id: trackingId
    }); // set data to the all file
    console.log("File Count Increment By One Using Data Base : ", allFileCount);
    alert("File Added Successfully");
    setDoc(doc(db, `All_Files/${trackingId}/Updates`, "Update 1"), {
        Owner_Name: ownerName,
        Owner_No: ownerNo,
        Owner_Email: ownerEmail,
        Subject: subject,
        Colour: color,
        Total_Pages: totalPages,
        description: description,
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        Status : "Generated",
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough,
        File_Count: allFileCount,
        Tracking_Id: trackingId
    });// help to track all changes(updates) in file 

    const citiesRef = collection(db, "User");
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
        Owner_No: ownerNo,
        Owner_Email: ownerEmail,
        Subject: subject,
        Colour: color,
        Total_Pages: totalPages,
        description: description,
        Department: department,
        Sub_Department: subDepartment,
        Officer_Name: officerName,
        Date: date,
        Time: time,
        Status: "Pending",
        FWD_Department: fwdDepartment,
        FWD_Sub_Department: fwdSubDepartment,
        FWD_OfficerName: fwdOfficerName,
        FWD_Through: fwdThrough,
        File_Count: allFileCount,
        Tracking_Id: trackingId
    })
    alert("Notification Send 📤 To The Forworded Department")

    console.log("Data added to The Updates Collection");
    setDoc(doc(db, `allUser/+91${ownerNo}/allFile`, trackingId), {
        name: ownerName,
        mobileNumber: ownerNo,
        email: ownerEmail,
        colour: color,
        fileName: subject,
        totalPages: totalPages,
        fileStatus: "Pending",
        submitDate: date,
        submitTime: time,
        lastUpdateDate: date,
        lastUpdateTime: time,
        submitReason: description,
        lastUpdateReason: "",
        submitDepartment: department,
        submitSubDepartment: subDepartment,
        officerName: officerName,
        currentDepartment: fwdDepartment,
        currentSubDepartment: fwdSubDepartment,
        Tracking_Id: trackingId
    });// All user data for application

    setDoc(doc(db, `allUser/+91${ownerNo}`), {
        name: ownerName,
        mobileNumber: ownerNo,
        email: ownerEmail,
    });// All user data for application

    const fileCollapp = collection(db, `All_Files/${trackingId}/Updates`);
    const fileSnapShotapp = await getCountFromServer(fileCollapp);
    let updateCountapp = "Update " + (fileSnapShotapp.data().count + 1); // File Count Increment, get current File Count For All_Files
    console.log("Update Count", updateCountapp);
    
    setDoc(doc(db, `allUser/+91${ownerNo}/notification`, updateCountapp), {
        TrackingId : trackingId,
        fileStatus: "Pending",
        lastUpdateDate: date,
        lastUpdateTime: time
    }); // for application

});

