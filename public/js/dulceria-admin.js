import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";import { db } from "./firebaseconect.js";


// Create a reference to the collection
const dulcesCollection = collection(db, 'dulces');

export function toggleForm() {
    const formContainer = document.getElementById('addMovieFormContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

export async function addMovie(event) {
    event.preventDefault();

    const tituloDulce = document.getElementById('movieTitle').value;
    const descriptionDulce = document.getElementById('movieDescription').value;
    const precioDulce = document.getElementById('moviePrice').value;
    const imageUrl = document.getElementById('movieImage').value;

    const dulce = {
        tituloDulce,
        descriptionDulce,
        precioDulce,
        imageFileDulce: imageUrl
    };

    try {
        await addDoc(dulcesCollection, dulce);
        alert('Artículo agregado exitosamente');
        document.getElementById('movieForm').reset();
        toggleForm();
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error al agregar el artículo: ' + error.message);
    }
}

export async function editProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('editMovieId').value;
    const tituloDulce = document.getElementById('editMovieTitle').value;
    const descriptionDulce = document.getElementById('editMovieDescription').value;
    const precioDulce = document.getElementById('editMoviePrice').value;
    const imageUrl = document.getElementById('editMovieImage').value;

    const updatedDulce = {
        tituloDulce,
        descriptionDulce,
        precioDulce,
        imageFileDulce: imageUrl
    };

    try {
        const docRef = doc(db, 'dulces', productId);
        await updateDoc(docRef, updatedDulce);
        alert('Artículo actualizado exitosamente');
        document.getElementById('editMovieFormContainer').style.display = 'none';
    } catch (error) {
        console.error('Error updating document: ', error);
        alert('Error al actualizar el artículo: ' + error.message);
    }
}

export async function deleteProduct(productId) {
    try {
        const docRef = doc(db, 'dulces', productId);
        await deleteDoc(docRef);
        alert('Artículo eliminado exitosamente');
    } catch (error) {
        console.error('Error deleting document: ', error);
        alert('Error al eliminar el artículo: ' + error.message);
    }
}

async function populateEditForm(productId) {
    try {
        const docRef = doc(db, 'dulces', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('editMovieId').value = productId;
            document.getElementById('editMovieTitle').value = data.tituloDulce;
            document.getElementById('editMovieDescription').value = data.descriptionDulce;
            document.getElementById('editMoviePrice').value = data.precioDulce;
            document.getElementById('editMovieImage').value = data.imageFileDulce;
        }
    } catch (error) {
        console.error('Error loading product data: ', error);
        alert('Error al cargar los datos del producto');
    }
}

function createProductCard(product, id) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const img = document.createElement('img');
    img.src = product.imageFileDulce;
    img.className = 'movie-image';
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
    };

    const movieInfo = document.createElement('div');
    movieInfo.className = 'movie-info';
    movieInfo.innerHTML = `
        <div class="movie-title">${product.tituloDulce}</div>
        <div class="movie-description">${product.descriptionDulce}</div>
        <div class="movie-price">$${product.precioDulce}</div>
    `;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Editar';
    editButton.onclick = () => {
        populateEditForm(id);
        document.getElementById('editMovieFormContainer').style.display = 'block';
    };

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = () => openDeleteModal(id);

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    movieCard.appendChild(img);
    movieCard.appendChild(movieInfo);
    movieCard.appendChild(buttonGroup);

    return movieCard;
}

export function displayProducts() {
    const moviesGrid = document.getElementById('moviesGrid');

    onSnapshot(dulcesCollection, (snapshot) => {
        moviesGrid.innerHTML = '';

        snapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = createProductCard(product, doc.id);
            moviesGrid.appendChild(productCard);
        });
    });
}