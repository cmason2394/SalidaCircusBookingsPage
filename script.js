//dynamic functionality for a calendar for Salida Circus bookings. Allows navigation through months and adding events to the calendar.

//keep track of which month we are looking at
let nav = 0;
//day clicked on
let clicked = null;

let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar'); 
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//function to add or delete an event in the calendar. 
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        console.log("Event already exists");
    }
    else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date();

    //check to see if user has navigated ahead or behind in the calendar
    //render the matching month
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    /*look at year, the next month (month + 1) and then the last day
    day of the previous month (0). */
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    //date object that starts on the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);

    //string from date object that includes the name of the weekday on which the month starts
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    } );

    //determine number of "padding days" before first of month starts on calendar.
    //Match firstDayOfMonth weekday to the array of weekdays created
    const paddingDays = firstDayOfMonth.getDay();
    
    //Header with the name and year of the current month
    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`;

    //reset all the squares to blank before rendering new ones with the below for loop
    calendar.innerHTML = '';

    //Loop to create the number of squares needed for any given calendar month,
    //with the appropriate number of padding days
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            daySquare.addEventListener('click', () => openModal(`${month + 1}/${i - paddingDays}/${year}`));
        }

        else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
    
}

//function to close the pop-up window of an event after saving or cancelling it
function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

//function to save an event
function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
            //time: 
            //location:
        });

        localStorage.setItem('events', JSON.stringify(events));

        closeModal();

    } else {
        eventTitleInput.classList.add('error');
    }
}

//function to make the buttons work. next button increments the page to the next month
//back button decrements the page to the previous month
//save button saves a new event
//cancel button cancels an event
function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);

    document.getElementById('cancelButton').addEventListener('click', closeModal);
}

initButtons();
load();