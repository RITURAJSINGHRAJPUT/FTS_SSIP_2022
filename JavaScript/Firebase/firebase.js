//  alert("Firebase Connection Successfully 🤝");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-analytics.js";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCJS1dLW2iMwxFPG1UHbhnN00lBZoP0P_c",
  authDomain: "file-tracking-system-fts.firebaseapp.com",
  projectId: "file-tracking-system-fts",
  storageBucket: "file-tracking-system-fts.appspot.com",
  messagingSenderId: "468494619862",
  appId: "1:468494619862:web:ea6b72f9b1159472eea577",
  measurementId: "G-7VJJY95DT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(app);
