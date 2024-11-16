import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const moviesContainer = document.getElementById('moviesContainer');
const searchBar = document.getElementById('searchBar');
let moviesData = [];

function addMinutesToTime(timeStr, minutesToAdd) {
    if (!timeStr) {
        return "Horario no disponible";
    }

    try {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes) + minutesToAdd);

        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error processing time:', error);
        return "Horario no disponible";
    }
}

function formatShowtime(showtime) {
    if (!showtime) return "Horario no disponible";

    try {
        return new Date(`2024-01-01T${showtime}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting showtime:', error);
        return "Horario no disponible";
    }
}

function createMovieCard(movie) {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie';

    const formattedShowtime = formatShowtime(movie.showtime);
    const duration = movie.duration || "No especificada";

    movieElement.innerHTML = `
        <img src="${movie.imageFilePelicula || '../img/placeholder.jpg'}" 
             alt="${movie.titulo}" 
             onerror="this.src='../img/placeholder.jpg'">
        <div class="details">
            <h2>${movie.titulo || 'Sin título'}</h2>
            <p>Duración: ${duration} minutos</p>
            <div class="times">
                <button>${formattedShowtime}</button>
                ${movie.showtime ? `
                    <button>${addMinutesToTime(movie.showtime, 30)}</button>
                    <button>${addMinutesToTime(movie.showtime, 60)}</button>
                ` : '<button>Horario no disponible</button>'}
            </div>
            <div class="quality">
                <label>Calidad:</label>
                <button>2D</button>
                <button>3D</button>
            </div>
        </div>
    `;

    return movieElement;
}

function displayMovies(movies) {
    if (!moviesContainer) {
        console.error('Movies container not found');
        return;
    }

    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p class="no-movies">No se encontraron películas</p>';
        return;
    }

    movies.forEach(movie => {
        if (movie) {
            const movieCard = createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
        }
    });
}

if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMovies = moviesData.filter(movie =>
            movie && movie.titulo && movie.titulo.toLowerCase().includes(searchTerm)
        );
        displayMovies(filteredMovies);
    });
}

try {
    const carteleraCollection = collection(window.db, 'cartelera');
    onSnapshot(carteleraCollection, (snapshot) => {
        moviesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayMovies(moviesData);
    }, (error) => {
        console.error('Error fetching movies:', error);
        moviesContainer.innerHTML = '<p class="error">Error al cargar las películas</p>';
    });
} catch (error) {
    console.error('Error setting up Firebase listener:', error);
    moviesContainer.innerHTML = '<p class="error">Error al conectar con la base de datos</p>';
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.times button, .quality button')) {
        const buttonGroup = e.target.parentElement;
        buttonGroup.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });

        e.target.classList.add('active');
    }
});