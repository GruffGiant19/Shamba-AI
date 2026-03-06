import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAeNUT_q_XxQyi-avOAs9pmoQshxYMkjvE",
  authDomain: "shamba-ai-7ad2f.firebaseapp.com",
  projectId: "shamba-ai-7ad2f",
  storageBucket: "shamba-ai-7ad2f.firebasestorage.app",
  messagingSenderId: "623576585983",
  appId: "1:623576585983:web:dca1621de19f010b6c9eca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;