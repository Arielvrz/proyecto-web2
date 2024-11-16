import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from "./firebaseconect.js";


const promosCollection = collection(db, 'promos');


export function toggleForm() {
    const formContainer = document.getElementById('addPromoFormContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}


export async function addPromo(event) {
    event.preventDefault();

    const tituloPromo = document.getElementById('promoTitle').value;
    const descripcionPromo = document.getElementById('promoDescription').value;
    const precioPromo = parseFloat(document.getElementById('promoPrice').value);
    const fechaInicio = new Date(document.getElementById('promoStartDate').value);
    const fechaFin = new Date(document.getElementById('promoEndDate').value);
    const imageUrl = document.getElementById('promoImage').value;

    const promo = {
        tituloPromo,
        descripcionPromo,
        precioPromo,
        fechaInicio,
        fechaFin,
        imagenPromocion: imageUrl
    };

    try {
        await addDoc(promosCollection, promo);
        alert('Promoción agregada exitosamente');
        document.getElementById('promoForm').reset();
        toggleForm();
    } catch (error) {
        console.error('Error al agregar el documento: ', error);
        alert('Error al agregar la promoción: ' + error.message);
    }
}


export async function editPromo(event) {
    event.preventDefault();

    const promoId = document.getElementById('editPromoId').value;
    const tituloPromo = document.getElementById('editPromoTitle').value;
    const descripcionPromo = document.getElementById('editPromoDescription').value;
    const precioPromo = parseFloat(document.getElementById('editPromoPrice').value);
    const fechaInicio = new Date(document.getElementById('editPromoStartDate').value);
    const fechaFin = new Date(document.getElementById('editPromoEndDate').value);
    const imageUrl = document.getElementById('editPromoImage').value;

    const updatedPromo = {
        tituloPromo,
        descripcionPromo,
        precioPromo,
        fechaInicio,
        fechaFin,
        imagenPromocion: imageUrl
    };

    try {
        const docRef = doc(db, 'promos', promoId);
        await updateDoc(docRef, updatedPromo);
        alert('Promoción actualizada exitosamente');
        document.getElementById('editPromoFormContainer').style.display = 'none';
    } catch (error) {
        console.error('Error al actualizar el documento: ', error);
        alert('Error al actualizar la promoción: ' + error.message);
    }
}


export async function deletePromo(promoId) {
    try {
        const docRef = doc(db, 'promos', promoId);
        await deleteDoc(docRef);
        alert('Promoción eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar el documento: ', error);
        alert('Error al eliminar la promoción: ' + error.message);
    }
}


async function populateEditForm(promoId) {
    try {
        const docRef = doc(db, 'promos', promoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('editPromoId').value = promoId;
            document.getElementById('editPromoTitle').value = data.tituloPromo;
            document.getElementById('editPromoDescription').value = data.descripcionPromo;
            document.getElementById('editPromoPrice').value = data.precioPromo;
            document.getElementById('editPromoStartDate').value = data.fechaInicio.toDate().toISOString().slice(0, 10);
            document.getElementById('editPromoEndDate').value = data.fechaFin.toDate().toISOString().slice(0, 10);
            document.getElementById('editPromoImage').value = data.imagenPromocion;
        }
    } catch (error) {
        console.error('Error al cargar los datos de la promoción: ', error);
        alert('Error al cargar los datos de la promoción');
    }
}


function createPromoCard(promo, id) {
    const promoCard = document.createElement('div');
    promoCard.className = 'promo-card';

    const img = document.createElement('img');
    img.src = promo.imagenPromocion;
    img.className = 'promo-image';
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
    };

    const promoInfo = document.createElement('div');
    promoInfo.className = 'promo-info';
    promoInfo.innerHTML = `
        <div class="promo-title">${promo.tituloPromo}</div>
        <div class="promo-description">${promo.descripcionPromo}</div>
        <div class="promo-price">$${promo.precioPromo}</div>
        <div class="promo-dates">${promo.fechaInicio.toDate().toLocaleDateString()} - ${promo.fechaFin.toDate().toLocaleDateString()}</div>
    `;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Editar';
    editButton.onclick = () => {
        populateEditForm(id);
        document.getElementById('editPromoFormContainer').style.display = 'block';
    };

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = () => openDeleteModal(id);

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    promoCard.appendChild(img);
    promoCard.appendChild(promoInfo);
    promoCard.appendChild(buttonGroup);

    return promoCard;
}


export function displayPromos() {
    const promosGrid = document.getElementById('promosGrid');

    onSnapshot(promosCollection, (snapshot) => {
        promosGrid.innerHTML = '';

        snapshot.forEach((doc) => {
            const promo = doc.data();
            const promoCard = createPromoCard(promo, doc.id);
            promosGrid.appendChild(promoCard);
        });
    });
}