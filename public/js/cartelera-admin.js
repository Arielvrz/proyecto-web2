import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from "./firebaseconect.js";

const carteleraCollection = collection(db, 'cartelera');

export function toggleForm() {
    const formContainer = document.getElementById('addMovieFormContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

export async function addMovie(event) {
    event.preventDefault();

    const titulo = document.getElementById('movieTitle').value;
    const descripcion = document.getElementById('movieDescription').value;
    const precio = document.getElementById('moviePrice').value;
    const imageUrl = document.getElementById('movieImage').value; // Changed to URL input

    const pelicula = {
        titulo,
        descripcion,
        precio: parseFloat(precio),
        imageFilePelicula: imageUrl // Store URL directly
    };

    try {
        await addDoc(carteleraCollection, pelicula);
        alert('Película agregada exitosamente');
        document.getElementById('movieForm').reset();
        toggleForm();
    } catch (error) {
        console.error('Error al agregar la película: ', error);
        alert('Error al agregar la película: ' + error.message);
    }
}

function createMovieCard(movie, id) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const img = document.createElement('img');
    img.src = movie.imageFilePelicula;
    img.className = 'movie-image';
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
    };

    const movieInfo = document.createElement('div');
    movieInfo.className = 'movie-info';
    movieInfo.innerHTML = `
        <div class="movie-title">${movie.titulo}</div>
        <div class="movie-description">${movie.descripcion}</div>
        <div class="movie-price">$${movie.precio.toFixed(2)}</div>
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

async function populateEditForm(movieId) {
    try {
        const docRef = doc(db, 'cartelera', movieId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('editMovieId').value = movieId;
            document.getElementById('editMovieTitle').value = data.titulo;
            document.getElementById('editMovieDescription').value = data.descripcion;
            document.getElementById('editMoviePrice').value = data.precio;
            document.getElementById('editMovieImage').value = data.imageFilePelicula;
        }
    } catch (error) {
        console.error('Error al cargar los datos de la película: ', error);
        alert('Error al cargar los datos de la película');
    }
}

export async function editMovie(event) {
    event.preventDefault();

    const movieId = document.getElementById('editMovieId').value;
    const titulo = document.getElementById('editMovieTitle').value;
    const descripcion = document.getElementById('editMovieDescription').value;
    const precio = parseFloat(document.getElementById('editMoviePrice').value);
    const imageUrl = document.getElementById('editMovieImage').value;

    const updatedMovie = {
        titulo,
        descripcion,
        precio,
        imageFilePelicula: imageUrl
    };

    try {
        const docRef = doc(db, 'cartelera', movieId);
        await updateDoc(docRef, updatedMovie);
        alert('Película actualizada exitosamente');
        document.getElementById('editMovieFormContainer').style.display = 'none';
    } catch (error) {
        console.error('Error al actualizar la película: ', error);
        alert('Error al actualizar la película: ' + error.message);
    }
}

export async function deleteMovie(movieId) {
    try {
        const docRef = doc(db, 'cartelera', movieId);
        await deleteDoc(docRef);
        alert('Película eliminada exitosamente');
        document.getElementById('deleteModal').style.display = 'none';
    } catch (error) {
        console.error('Error al eliminar la película: ', error);
        alert('Error al eliminar la película: ' + error.message);
    }
}

export function displayMovies() {
    const moviesGrid = document.getElementById('moviesGrid');

    onSnapshot(carteleraCollection, (snapshot) => {
        moviesGrid.innerHTML = '';

        snapshot.forEach((doc) => {
            const movie = doc.data();
            const movieCard = createMovieCard(movie, doc.id);
            moviesGrid.appendChild(movieCard);
        });
    });
}