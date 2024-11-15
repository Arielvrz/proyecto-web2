


// Función para abrir el modal
function openModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; 
}

// Cerrar el modal
window.onclick = function(event) {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
        closeModal();
    }
};



