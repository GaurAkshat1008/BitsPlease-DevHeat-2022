import { onAuthStateChanged } from "@firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import Cookies from "js-cookie";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { v4 } from "uuid";

const context = createContext(null);
export function useFirebase() {
  return useContext(context);
}

export function FunctionProvider({ children }) {
  const [loading, setloading] = useState(false);

  async function getItems(location: string) {
    const citiesRef = collection(db, "items");
    const q = query(citiesRef, where("location", "==", location));
    const querySnapshot = getDocs(q);
    let list = [];
    (await querySnapshot).forEach((doc) => {
      list.push(doc.data());
    });
    return list;
  }

  async function addToCart(id: string) {
    const data = {
      id: id,
    }
    await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });
  }

  async function addItems(
    vendor: any,
    name: any,
    price: any,
    details: any,
    location: string
    ) {
      const id = v4();
    const item = {
      id,
      vendor: vendor,
      name: name,
      price: price,
      details,
      location,
    };
    await setDoc(doc(db, "items", id), item, { merge: true });
  }
  
  async function getLocation(location:string) {
    if(auth){
      const data = {
        location: location,
      }
      await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });
    }
  }

  async function setUser(occ: string) {
    if (auth) {
      const data = {
        occupation: occ,
        user: auth.currentUser.email,
      };
      // console.log(data);
      await setDoc(doc(db, "users", auth.currentUser.uid), data, {
        merge: true,
      });
    }
  }

  async function getUser() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
    } else {
      console.log("No such document!");
    }
    return { data: docSnap.data(), exists: docSnap.exists() };
  }

  function useAuth() {
    const [authState, setAuthState] = useState({
      isSigned: false,
      user: null,
      pending: true,
    });
    useEffect(() => {
      const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthState({ isSigned: true, user, pending: false });
        }
      });
      return () => unregisterAuthObserver();
    }, []);
    return { auth, ...authState };
  }

  async function signIn() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
        auth_type: "reauthenticate",
      });
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      Cookies.set(
        "user",
        JSON.stringify({
          email: result.user.email,
        })
      );
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function gSignOut() {
    try {
      await signOut(auth);
      Cookies.remove("Occupation");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function setCookiesForOccupation(occ: string) {
    Cookies.set(
      "Occupation",
      JSON.stringify({
        occupation: occ,
      })
    );
  }

  async function getCookiesOfOccupation() {
    const occ = Cookies.get("Occupation");
    if (occ) {
      const details = JSON.parse(occ);
      return { details };
    }
    return false;
  }

  async function checkCookiesOfOccupation() {
    const occ = Cookies.get("Occupation");
    if (occ) {
      return true;
    }
    return false;
  }

  const value = {
    useAuth,
    signIn,
    gSignOut,
    setCookiesForOccupation,
    getCookiesOfOccupation,
    checkCookiesOfOccupation,
    setUser,
    getUser,
    addToCart,
    getItems,
    addItems,
    getLocation,
  };
  return (
    <context.Provider value={value}>{!loading && children}</context.Provider>
  );
}
