import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBmDZLdENiHDSFNA-C1v3z8OSXFidS74Hk",
    authDomain: "fir-57d50.firebaseapp.com",
    projectId: "fir-57d50",
    storageBucket: "fir-57d50.appspot.com",
    messagingSenderId: "238271491052",
    appId: "1:238271491052:web:d8ed313eda9be3fd37aec9",
    measurementId: "G-3S2E4QLMY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// const likedLIst = (userAddress) => {
//     const likedRef = collection(db, 'likedLIst')
//     return addDoc(likedRef, {
//             created: serverTimestamp(),
//             users: [{ name: userAddress }]
//         });
// };

export default db;
