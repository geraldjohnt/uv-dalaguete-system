// // FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAuGUqYxLWChDQxTFPHVdxUlsUYxkvOaXM",
  authDomain: "uv-dalaguete-system.firebaseapp.com",
  databaseURL: "https://uv-dalaguete-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uv-dalaguete-system",
  storageBucket: "uv-dalaguete-system.firebasestorage.app",
  messagingSenderId: "321476835892",
  appId: "1:321476835892:web:de03fed7988aff0fa26861",
  measurementId: "G-P19HMKN322"
};

// INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);

// REALTIME DATABASE
const db = firebase.database();

console.log('Firebase Connected');