//SIMULADOR COTIZADOR SEGUROS

//Selección HTML
const formulario = document.querySelector('#cotizar-seguro');
const selectYear = document.querySelector('#year');
const resultadoCoti = document.querySelector('#resultado');
const spinner = document.querySelector('#spinner');

//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function() {
    /*
    MARCA:
    1 = Americano => +15%
    2 = Asiatico => +5%
    3 = Europeo => +35%
    */
    const base = 2000;
    let cantidad;

    switch (this.marca) {
    case '1':
        cantidad = base * 1.15;
        break;  
    case '2':
        cantidad = base * 1.05;
        break;
    case '3':
        cantidad = base * 1.35;
        break;
   }

    //AÑO:Por cada año más antiguo se restará un 3% de la cantidad base
    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
    Básico: +30%
    Completo: +50%
    */
    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

//--//
function InterfaceUser() { }

InterfaceUser.prototype.llenarOpciones = function() {
    const max = new Date().getFullYear();
    const min = max - 15;

    for (let i = max; i >= min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

InterfaceUser.prototype.mostrarMensaje = function(mensaje, tipo) {
    const divMsg = document.createElement('div');

    if(tipo === 'error') {
        divMsg.classList.add('error');
    } else {
        divMsg.classList.add('correcto');
    }

    divMsg.classList.add('mensaje', 'mt-10');
    divMsg.textContent = mensaje;

    formulario.insertBefore(divMsg, document.querySelector('#resultado'));

    setTimeout(() => {
        divMsg.remove();
    }, 2000);
}

InterfaceUser.prototype.mostrarResultado = function(seguro, total) {
    const { marca, year, tipo } = seguro;
    let marcaText;

    switch(marca) {
        case "1":
            marcaText = "Americano";
            break;
        case "2":
            marcaText = "Asiatico";
            break;
        case "3":
            marcaText = "Europeo";
            break;
    }

    const divResult = document.createElement('div');
    divResult.classList.add('mt-10');

    divResult.innerHTML = `
        <p class="header">Tu Cotización</p>
        <p class="font-bold">Marca: <span class="font-normal">${marcaText}</span> </p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span> </p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span> </p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span> </p>
    `;

    spinner.classList.remove("hidden");

    setTimeout(() => {
        spinner.classList.add("hidden");
        resultadoCoti.appendChild(divResult);
    }, 2000)
}

//Intancia
const interfaceUser = new InterfaceUser();

//Eventos
document.addEventListener('DOMContentLoaded', () => {
    interfaceUser.llenarOpciones();
});

cargarEventos();

function cargarEventos() {
    formulario.addEventListener('submit', e => cotizarSeguro(e));
}

//Funciones
function cotizarSeguro(e) {
    e.preventDefault();

    limpiarHTML(resultadoCoti);

    const marca = formulario.querySelector('#marca').value;
    const year = formulario.querySelector('#year').value;
    const tipo = formulario.querySelector('input[name="tipo"]:checked').value;
    //Forma de selección CSS de tipo input[atributo="valor"]:atributoDeclarado
    
    if(marca === ''|| year === '') {
        interfaceUser.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    interfaceUser.mostrarMensaje('Cotizando...', 'correcto');

    //Intancia
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    interfaceUser.mostrarResultado(seguro, total);
}

//--//
function limpiarHTML(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}