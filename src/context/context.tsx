import { onAuthStateChanged } from "@firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase/firebase";
import Cookies from "js-cookie";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
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

  async function getCartItems() {
    const { data, exists } = await getUser();
    const itemsids = data.item_id;
    const cartRef = collection(db, "items");
    let list = [];
    console.log(exists);
    if (exists) {
      itemsids.forEach(async (id: any) => {
        const q = query(cartRef, where("id", "==", id));
        const querySnapshot = getDocs(q);
        (await querySnapshot).forEach((doc) => {
          console.log(doc.data());
          list.push(doc.data());
        });
        console.log(list);
        return list;
      });
    }
  }
  async function addToCart(id: string) {
    const data = {
      item_id: arrayUnion(id),
    };
    await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });
  }

  async function addItems(
    vendor: any,
    name: any,
    price: any,
    location: string,
    images: any
  ) {
    const id = v4();
    const imgUrls = [];
    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(
        storage,
        `images/${auth.currentUser.email}/${images[i].name + v4()}`
      );
      // console.log(images[i])
      // console.log(`images/${auth.currentUser.email}/${images[i].name + v4()}`);
      await uploadBytes(imageRef, images[i]).then(() => {
        console.log("uploaded");
      });
      const url = await getDownloadURL(imageRef);
      // imgUrls[i] = url;
      imgUrls.push(url);
    }
    const item = {
      id,
      vendor: auth.currentUser.displayName,
      name: name,
      price: price,
      location,
      URLS: imgUrls,
    };
    console.log(item)
    await setDoc(doc(db, "items", id), item, { merge: true });
  }

  async function getLocation(location: string) {
    if (auth) {
      const data = {
        location: location,
      };
      await setDoc(doc(db, "users", auth.currentUser.uid), data, {
        merge: true,
      });
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
      // console.log(docSnap.data());
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
    getCartItems,
  };
  return (
    <context.Provider value={value}>{!loading && children}</context.Provider>
  );
}
