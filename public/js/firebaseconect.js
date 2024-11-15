import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import {getFirestore,collection, addDoc, getDocs,getCountFromServer, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0roTVIABITj-2d1wrUUNG3iOOY1z38EI",
    authDomain: "proyecto-final-cine.firebaseapp.com",
    projectId: "proyecto-final-cine",
    storageBucket: "proyecto-final-cine.firebasestorage.app",
    messagingSenderId: "775284031195",
    appId: "1:775284031195:web:5423fb031b86cc70e296fe",
    measurementId: "G-TNZBPMMRQ0"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

const db=getFirestore()



export class ManageAccount {
  register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "login.html";
        // Mostrar alerta de registro exitoso
        alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
      })
      .catch((error) => {
        console.error(error.message);
            // Mostrar alerta de error de registro
            alert("Error al registrar: " + error.message);
      });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "index.html";
        // Mostrar alerta de inicio de sesión exitoso
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      })
      .catch((error) => {
        console.error(error.message);
                // Mostrar alerta de error de inicio de sesión
                alert("Error al iniciar sesión: " + error.message);
      });
  }

  signOut() {
    signOut(auth)
      .then((_) => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export const saveProduct=(product)=>{
    addDoc(collection(db,'products'),product);
  }

export const getProducts=()=>getDocs(collection(db,'products'))

export const getProduct=(id)=>getDoc(doc(db,'products',id))

export const getProductListSize=async()=>{
    const products = collection(db, "products");
    const snapshot = await getCountFromServer(products);
    return snapshot.data().count;
  }
  
export const deleteProduct=(id)=> deleteDoc(doc(db,'products',id))
export const updateProduct=(id, newFields)=>updateDoc(doc(db,'products',id), newFields)


console.log("Firebase conectado");
