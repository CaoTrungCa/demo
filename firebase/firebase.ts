import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "blog-cao.firebaseapp.com",
    projectId: "blog-cao",
    storageBucket: "blog-cao.appspot.com",
    messagingSenderId: "331259749293",
    appId: "1:331259749293:web:f6afdfe6b24fc9b5d07724"
};

export const app = initializeApp(firebaseConfig);
