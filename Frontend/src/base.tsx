import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCs-RZVFpzaVgUmq2t58iMCgPW3qHqZkrU",
  authDomain: "bangsgarage.firebaseapp.com",
  projectId: "bangsgarage",
  storageBucket: "bangsgarage.appspot.com",
  messagingSenderId: "926812595227",
  appId: "1:926812595227:web:efb9a53a59ee75f03404be",
  measurementId: "G-QSD5N1NVLE"
};

const app = initializeApp(firebaseConfig);
const inicialize = firebase.initializeApp(firebaseConfig)
const storage = firebase.storage();
const auth = getAuth(app);
const provider = new GoogleAuthProvider()
const db = firebase.firestore();
const firestore = firebase.firestore();

const convertUrlToFullUrl = (url: string) => {
  if(url == "")
    return ""
  const storage = getStorage();
  const pathReference = ref(storage, url);
  return getDownloadURL(pathReference)
}

export { storage, firebase, inicialize, db, firestore, auth, convertUrlToFullUrl, provider }