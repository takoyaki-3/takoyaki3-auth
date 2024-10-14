import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyB6ryhdvSKRnqDOWUQj5mjqstSnFGQuOE0",
  authDomain: "takoyaki3-auth.web.app",
  projectId: "takoyaki3-auth",
  storageBucket: "takoyaki3-auth.appspot.com",
  messagingSenderId: "1035381562180",
  appId: "1:1035381562180:web:faf0cff68429ea0277d511",
  measurementId: "G-VMHG0XJM45"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// FirebaseUIの設定
const uiConfig = {
  signInSuccessUrl: '/',  // 認証後にリダイレクトするURL
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '/terms',  // 利用規約ページ
  privacyPolicyUrl: '/privacy',  // プライバシーポリシーページ
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, ui, uiConfig };
