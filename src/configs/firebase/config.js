import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDb-Svw6opsa8NwzIvF13AjXTbg4c-TeTc',
  authDomain: 'travel-bk.firebaseapp.com',
  projectId: 'travel-bk',
  storageBucket: 'travel-bk.appspot.com',
  messagingSenderId: '788098281608',
  appId: '1:788098281608:web:09c103df02e5223282ef3d',
  measurementId: 'G-QD6PYYB1MP',
};
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore, firebase };
