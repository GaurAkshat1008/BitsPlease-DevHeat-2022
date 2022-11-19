import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: "AIzaSyDQk4yLlJGHTpN0pJd3GbkLJ0EL5ioKcaM",
  // authDomain: "citysync-1618f.firebaseapp.com",
  // projectId: "citysync-1618f",
  // storageBucket: "citysync-1618f.appspot.com",
  // messagingSenderId: "890075454415",
  // appId: "1:890075454415:web:de5edc2b05dcc09a36d0ba",
  // measurementId: "G-PGL5KBZNYS"
  // apiKey: "AIzaSyDyIDoL2vSh99-tl9p0NM_iJvYu4djRAhw",
  // authDomain: "rand-8040f.firebaseapp.com",
  // projectId: "rand-8040f",
  // storageBucket: "rand-8040f.appspot.com",
  // messagingSenderId: "895857525635",
  // appId: "1:895857525635:web:7f34de0b603c256c492cb6",
  // measurementId: "G-KVYKXGK4VH"
  apiKey: "AIzaSyAcWh5izjNtle10v4UiJXx8SjkdwqV3Jqs",
  authDomain: "projectalpha-76dbc.firebaseapp.com",
  projectId: "projectalpha-76dbc",
  storageBucket: "projectalpha-76dbc.appspot.com",
  messagingSenderId: "332373726321",
  appId: "1:332373726321:web:ff5b7f13db4c1da090b7d0",
  measurementId: "G-24NY5KXK2E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };