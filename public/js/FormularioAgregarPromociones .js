document.getElementById('FormularioAgregarPromociones').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('promotionName').value;
    const description = document.getElementById('promotionDescription').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const discount = document.getElementById('discount').value;


    alert('Promoción registrada con éxito');
    
    document.getElementById('FormularioAgregarPromociones').reset();
});
