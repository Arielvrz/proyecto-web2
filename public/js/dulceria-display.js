import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from "./firebaseconect.js";

const dulcesCollection = collection(db, 'dulces');

function createProductCard(product) {
    return `
        <div class="producto">
            <img src="${product.imageFileDulce}" alt="${product.tituloDulce}" class="img_dulceria" 
                 onerror="this.src='../img/placeholder.png'">
            <p class="nombre_combo">${product.tituloDulce}</p>
            <p class="descripcion_combo">${product.descriptionDulce}</p>
            <p class="precio">$${product.precioDulce}</p>
            <div class="agregar_producto">
                <img src="../img/agregar_icono.png" alt="agregar_icono" class="agregar_icono">
            </div>
        </div>
    `;
}

function displayProducts() {
    const productosContainer = document.getElementById('productos_container');

    onSnapshot(dulcesCollection, (snapshot) => {
        let productsHTML = '';

        snapshot.forEach((doc) => {
            const product = doc.data();
            productsHTML += createProductCard(product);
        });

        productosContainer.innerHTML = productsHTML;
    });
}

// Initialize the display
displayProducts();