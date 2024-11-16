import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const promosContainer = document.getElementById('promosContainer');

function formatDate(date) {
    if (!(date instanceof Date) && date.toDate) {
        date = date.toDate();
    }
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function isPromoActive(startDate, endDate) {
    const now = new Date();
    const start = startDate instanceof Date ? startDate : startDate.toDate();
    const end = endDate instanceof Date ? endDate : endDate.toDate();
    return now >= start && now <= end;
}

function createPromoCard(promo) {
    const promoDiv = document.createElement('div');
    promoDiv.className = 'promocion';

    const isActive = isPromoActive(promo.fechaInicio, promo.fechaFin);

    promoDiv.innerHTML = `
        <img src="${promo.imagenPromocion}" alt="${promo.tituloPromo}" 
             onerror="this.src='../img/placeholder.jpg'">
        <h2>${promo.tituloPromo}</h2>
        <p>${promo.descripcionPromo}</p>
        <p><strong>Precio:</strong> $${promo.precioPromo.toFixed(2)}</p>
        <p><strong>Comienza:</strong> ${formatDate(promo.fechaInicio)}</p>
        <p><strong>Termina:</strong> ${formatDate(promo.fechaFin)}</p>
        ${isActive ? '<span class="promo-badge active">Activa</span>'
        : '<span class="promo-badge inactive">Finalizada</span>'}
        <a href="#" onclick="event.preventDefault(); alert('Promoción seleccionada: ${promo.tituloPromo}')">
            Ver promoción
        </a>
    `;

    if (!isActive) {
        promoDiv.classList.add('expired');
    }

    return promoDiv;
}

function displayPromos(promos) {
    if (!promosContainer) {
        console.error('Promos container not found');
        return;
    }

    promosContainer.innerHTML = '';

    if (promos.length === 0) {
        promosContainer.innerHTML = '<p class="no-promos">No hay promociones disponibles</p>';
        return;
    }

    const sortedPromos = promos.sort((a, b) => {
        const aActive = isPromoActive(a.fechaInicio, a.fechaFin);
        const bActive = isPromoActive(b.fechaInicio, b.fechaFin);

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return b.fechaInicio.toDate() - a.fechaInicio.toDate();
    });

    sortedPromos.forEach(promo => {
        const promoCard = createPromoCard(promo);
        promosContainer.appendChild(promoCard);
    });
}

try {
    const promosCollection = collection(window.db, 'promos');
    onSnapshot(promosCollection, (snapshot) => {
        const promos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayPromos(promos);
    }, (error) => {
        console.error('Error fetching promos:', error);
        promosContainer.innerHTML = '<p class="error">Error al cargar las promociones</p>';
    });
} catch (error) {
    console.error('Error setting up Firebase listener:', error);
    promosContainer.innerHTML = '<p class="error">Error al conectar con la base de datos</p>';
}