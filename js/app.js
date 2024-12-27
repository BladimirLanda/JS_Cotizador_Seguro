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
    default:
        break;
   }

    /*
    AÑO:
    Por cada año más antiguo se restará un 3% de la cantidad base
    */
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
function InterfaceUser() {
}

InterfaceUser.prototype.llenarOpciones = function() {
    const max = new Date().getFullYear();
    const min = max - 14;

    for (let i = max; i >= min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

InterfaceUser.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10'); //Taiwling mt: margin-top
    div.textContent = mensaje;

    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 2000);
}

InterfaceUser.prototype.mostrarResultado = function(seguro, total) {
    const {marca, year, tipo} = seguro;
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
            break
        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Cotización</p>
        <p class="font-bold">Marca: <span class="font-normal">${marcaText}</span> </p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span> </p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span> </p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span> </p>
    `;

    spinner.classList.remove("hidden");

    setTimeout(() => {
        spinner.classList.add("hidden");
        resultadoCoti.appendChild(div);
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