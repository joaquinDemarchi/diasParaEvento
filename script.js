let events = [];
let arr = []; 

//guardar en varible los datos cargados por el usuario.
const eventName = document.querySelector('#eventName')
const eventDate = document.querySelector('#eventDate')
const buttonAdd = document.querySelector('#bAdd')
const eventsContainer = document.querySelector('#eventsContainer')

//Trae lo almacenado en el local storage y lo guarda en el json
const json = load()

try{
    arr =JSON.parse(json);
} catch (error){
    arr = []
}

events = arr ? [...arr] : [];

renderEvents();


//ASIGNA AL BOTON SUBMIT LA FUNCION DE CREAR EVENTO
document.querySelector("form").addEventListener('submit', (e) => {
    //deshabilita el comportamiento por defecto 
    e.preventDefault()
    addEvent();
});
//NO entiendo. ¿Hace lo mismo?
buttonAdd.addEventListener('click', (e) => {
    e.preventDefault()
    addEvent();
});

//FUNCION QUE CREA LOS EVENTOS EN BASE A LA INFO DEL USUARIO
function addEvent(){
    //controla que los campos no esten vacios
    if (eventName.value === '' || eventDate.value === ''){
        return;
    }
    //controla que la fecha se posterior a hoy
    if(dateDiff(eventDate.value) < 0){
        return;
    }
    //crea un objeto en el cual se le asigna los datos introducidos por el usuario
    const newEvent = {
        id: (Math.random()*100).toString(36).slice(3),
        name: eventName.value,
        date:eventDate.value
    };

    //agregamos el objeto a un array de los eventos
    events.unshift(newEvent);

    save(JSON.stringify(events))

    eventName.value = ""; //NO entiendo

    renderEvents();
}

//FUNCION QUE COMBIERTE LA HORA INTRODUCIDA POR USUARIO en DIAS RESTANTES.
function dateDiff(d){
    const targetDate = new Date(d);
    const dateNow = new Date();
    //descompone la fecha en numeros para obtener la dif con getTime
    const difference = targetDate.getTime() - dateNow.getTime();
    //convertimos el resultado a dias
    const days = Math.ceil(difference / (1000*3600*24))
    
    return days;

}

//FUNCION QUE PRESENTA LOS EVENTOS EN EL HTML Y LOS BOTONES CON SUS FUNCIONES
function renderEvents(){
    //pega los datos los eventos guardados en el arr en varios trozos de html
    //primero 
    const eventHTML = events.map(event => {
        //se repite el codigo por la cant de eventos que exista
        return `
                <div class='event'>
                    <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">dias</span>
                    </div>
                </div>
                <div>
                    <div class="event-name">${event.name}</div>
                    <div class="event-date">${event.date}</div>
                    <div class="actions" >
                        <button class = "bDelete" data-id="${event.id}" >Eliminar</button>
                    </div>
                </div>
        `;

        
    })

    //se unen todos los trozos de html recien generados mediante join
    eventsContainer.innerHTML = eventHTML.join('')

//LE DAMOS PODER A BOTONES DE ELIMINAR EVENTOS
    document.querySelectorAll('.bDelete').forEach(button => {
        //a cada boton de id bDelete se le agrega la funcion
        button.addEventListener('click', e => {
            const id = button.getAttribute('data-id');

            // Elimina el evento tambien de localStorage
            deleteEventFromLocalStorage(id);

            //los elimina usando un filtro en el array 
            events = events.filter(event =>(event.id !== id))

            renderEvents()
        })
    })
}

//FUNCION PARA QUE LOS EVENTOS SE GUARDEN EN EL LOCAL STORAGE
function save(data){
    return localStorage.setItem('items',data)
}

//FUNCION PARA QUE LOS EVENTOS SE CARGUEN EN EL LOCAL STORAGE
function load(){
    return localStorage.getItem('items')
}

//FUNCION PARA QUE LOS EVENTOS SE ELIMINEN EN EL LOCAL STORAGE
function deleteEventFromLocalStorage(id) {
    // Obtener los eventos del localStorage
    const json = load();
    let eventsFromLocalStorage = [];
    try {
        eventsFromLocalStorage = JSON.parse(json) || [];
    } catch (error) {
        eventsFromLocalStorage = [];
    }

    // Filtrar los eventos para eliminar el evento con el ID dado
    eventsFromLocalStorage = eventsFromLocalStorage.filter(event => event.id !== id);

    // Guardar los eventos actualizados en el localStorage
    save(JSON.stringify(eventsFromLocalStorage));
}