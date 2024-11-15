function openModal() {
    document.getElementById('addMovieModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addMovieModal').style.display = 'none';
    document.getElementById('movieForm').reset();
}

function addMovie(event) {
    event.preventDefault();

    const title = document.getElementById('movieTitle').value;
    const description = document.getElementById('movieDescription').value;
    const price = document.getElementById('moviePrice').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const imageFile = document.getElementById('movieImage').files[0];

    if (!title || !description || !price || !start || !end || !imageFile) {
        alert('Por favor complete todos los campos');
        return;
    }

    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const imageUrl = URL.createObjectURL(imageFile);
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'movie-image';

    const movieInfo = document.createElement('div');
    movieInfo.className = 'movie-info';
    movieInfo.innerHTML = `
                <div class="movie-title">${title}</div>
                <div class="movie-description">${description}</div>
                <div class="movie-start">${start}</div>
                <div class="movie-end">${end}</div>
                <div class="movie-price">$${price}</div>
            `;


    const manageButton = document.createElement('button');
    manageButton.className = 'manage-button';
    manageButton.textContent = 'Administrar';
    manageButton.onclick = function() {
        alert('Función de administración pendiente');
    };


    movieCard.appendChild(img);
    movieCard.appendChild(movieInfo);
    movieCard.appendChild(manageButton);

    document.getElementById('moviesGrid').appendChild(movieCard);

    closeModal();
}


window.onclick = function(event) {
    const modal = document.getElementById('addMovieModal');
    if (event.target === modal) {
        closeModal();
    }
}