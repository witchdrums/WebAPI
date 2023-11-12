const uri = "api/alumnos";
let todos = [];

const formNew = document.getElementById("formNew");
const formUpdate = document.getElementById("formUpdate");
const closeLink = document.querySelector(".close");

formNew.addEventListener("submit", (e) => {
    e.preventDefault();
    addItem();  
});

formUpdate.addEventListener("submit", (e) => {
    e.preventDefault();
    updateItem(); 
});

closeLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeInput(); 
});

function getItems(){
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error("No se han podido obtener los elementos.",error));
}

function addItem(){
    const addNombreTextbox = document.getElementById("add-nombre");
    const estaAprobadoCheckbox = document.getElementById("add-estaAprobado");

    const item = {
        estaAprobado: estaAprobadoCheckbox.checked,
        nombre: addNombreTextbox.value.trim()
    }

    fetch (uri, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNombreTextbox.value = "";
        })
        .catch(error => console.error("No se ha podido crear el elemento.",error));
}

function deleteItem(id){
    fetch(`${uri}/${id}`, {
        method: "DELETE"
    })
        .then(() => getItems())
        .catch(error => console.error("No se ha podido crear el elemento", error));
}

function displayEditForm(id){
    const item = todos.find(item => item.id === id);

    document.getElementById("edit-nombre").value = item.nombre;
    document.getElementById("edit-id").value = item.id;
    document.getElementById("edit-estaAprobado").checked = item.estaAprobado;
    document.getElementById("editForm").style.display = "block";
}

function updateItem(){
    const itemId = document.getElementById("edit-id").value;
    const item = {
        id: parseInt(itemId, 10),
        estaAprobado: document.getElementById("edit-estaAprobado").checked,
        nombre: document.getElementById("edit-nombre").value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error("No se ha podido actualizar el elemento.",error));

    closeInput();
    
    return false;
}

function closeInput() {
    document.getElementById("editForm").style.display = "none";
}

function _displayCount(itemCount){
    const nombre = (itemCount === 1) ? "alumno" : "alumnos";

    document.getElementById("counter").innerText = `${itemCount} ${nombre}`;
}

function _displayItems(data){
    const tBody = document.getElementById("todos");
    tBody.innerHTML = "";

    _displayCount(data.length);

    const button = document.createElement("button");

    data.forEach(item => {
        let estaAprobadoCheckbox = document.createElement("input");
        estaAprobadoCheckbox.name = `select-${item.id}`;
        estaAprobadoCheckbox.type = "checkbox";
        estaAprobadoCheckbox.disabled = true;
        estaAprobadoCheckbox.checked = item.estaAprobado;

        let editButton = button.cloneNode(false);
        editButton.innerText = "Editar";
        editButton.setAttribute("onclick", `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = "Eliminar";
        deleteButton.setAttribute("onclick", `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(estaAprobadoCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.nombre);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);	
    });

    todos = data;
}