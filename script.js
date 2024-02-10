let events = [];
let arr = []; //sirve para cargar informacion

const eventName = document.querySelector('#eventName')
const eventDate = document.querySelector('#eventDate')
const buttonAdd = document.querySelector('#bAdd')
const eventsContainer = document.querySelector('#eventsContainer')

//para almacenamiento de localstorage
const json = load()

try{
    arr =JSON.parse(json);
} catch (error){
    arr = []
}

events = arr ? [...arr] : [];

renderEvents();



document.querySelector("form").addEventListener('submit', (e) => {
    e.preventDefault()
    addEvent();
});

buttonAdd.addEventListener('click', (e) => {
    e.preventDefault()
    addEvent();
});

function addEvent(){
    //controla que los campos no esten vacios
    if (eventName.value === '' || eventDate.value === ''){
        return;
    }
    //controla que la fecha se posterior a hoy
    if(dateDiff(eventDate.value) < 0){
        return;
    }

    const newEvent = {
        id: (Math.random()*100).toString(36).slice(3),
        name: eventName.value,
        date:eventDate.value
    };

    events.unshift(newEvent);

    save(JSON.stringify(events))

    eventName.value = "";

    renderEvents();
}

function dateDiff(d){
    const targetDate = new Date(d);
    const dateNow = new Date();
    //descompone la fecha en numeros para obtener la dif con getTime
    const difference = targetDate.getTime() - dateNow.getTime();
    //convertimos el resultado a dias
    const days = Math.ceil(difference / (1000*3600*24))
    console.log(targetDate);
    console.log(dateNow.getTime);
    console.log(difference);
    console.log(days);
    return days;

}

function renderEvents(){
    const eventHTML = events.map(event => {
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

    eventsContainer.innerHTML = eventHTML.join('')

//funcion de eliminar eventos
    document.querySelectorAll('.bDelete').forEach(button => {
        button.addEventListener('click', e => {
            const id = button.getAttribute('data-id');
            //los elimina usando un filtro en el array 
            events = events.filter(event =>(event.id !== id))

            renderEvents()
        })
    })
}

//fucnion para que se guarden los datos en le local storage

function save(data){
    return localStorage.setItem('items',data)
}

function load(){
    return localStorage.getItem('items')
}