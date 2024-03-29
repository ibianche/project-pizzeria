import {utils} from "../utils.js";
import {select, settings, templates, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.clickedTable = [];


    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [
        startDateParam,
        endDateParam,
      ],

      eventsCurrent: [ /*wydarzenie jednorazowe*/
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventsRepeat: [ /*wydarzenie cykliczne*/
        settings.db.repeatParam,
    endDateParam,
  ],
  }
    ;
    // console.log('getData params', params);

    const urls = {
      bookings: settings.db.url + '/' + settings.db.bookings + '?' + params.bookings.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
    };


    Promise.all([
      fetch(urls.bookings), /*funkcja do połączenia się z serwerem*/
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(), /*przekształca  dane na typ json*/
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
      ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsRepeat);
        // console.log(eventsCurrent);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }


  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }

    //pętla po wydarzeniach jednorazowych
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker. minDate;
    const maxDate = thisBooking.datePicker. maxDate;


    //pętla po wydarzeniach cyklicznych
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table); /*item dane z bazy danych*/
        }
      }
    }
    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }


  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      // console.log('loop', index);


      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }


  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }else{
        table.classList.remove(classNames.booking.tableBooked);
      }

    }
  }


  render(element) {
    const thisBooking = this;
    //generuję kod za pomocą szablonu templates.bookingWidget
    const generatedHTML = templates.bookingWidget(element);

    //tworzę pusty obiekt
    thisBooking.dom = {};

    //dodaję do pustego obiektu własciwość wrapper i przupisuję referencję do kontenera
    thisBooking.dom.wrapper = element;

    //zmiana wartości wrappera innerHTML na kod wygenerowany z szablonu
    thisBooking.dom.wrapper.innerHTML = generatedHTML;


    thisBooking.dom.peopleAmount = document.querySelector(select.widgets.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.widgets.booking.hoursAmount);

    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.widgets.booking.tables);

    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.widgets.booking.floorPlan);

    thisBooking.dom.bookingForm = thisBooking.dom.wrapper.querySelector(select.widgets.booking.bookingForm);
    thisBooking.dom.bookingAddress = thisBooking.dom.wrapper.querySelector(select.widgets.booking.bookingAddress);
    thisBooking.dom.bookingPhone = thisBooking.dom.wrapper.querySelector(select.widgets.booking.bookingPhone);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.widgets.booking.starters);



  }

  initWidgets() {
    const thisBooking = this;
    //tworzę nową instancje AmountWidget
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function () {
      thisBooking.removeTableSelection();
    });

    //tworzę nową instancje AmountWidget
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function () {
      thisBooking.removeTableSelection();
    });

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.dom.datePicker.addEventListener('updated', function () {
      thisBooking.removeTableSelection();
    });

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.hourPicker.addEventListener('updated', function () {
      thisBooking.removeTableSelection();
    });

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

    thisBooking.dom.floorPlan.addEventListener('click', function (event) {   /*reaguje na kliknięcie diva ze stolikami*/
      thisBooking.initTables(event);
    });

    thisBooking.dom.bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    })


  }

  removeTableSelection(){ /*po zmianie widgetow(godzina,data,ilosc...) zeruje stolik*/
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {  /*sprawdzam czy inne stoliki ma klase selected*/
      table.classList.remove('selected'); /*jezeli ma to usuwam*/
    }
    thisBooking.clickedTable = null;

  }



  initTables(event) {
    const thisBooking = this;

    const clickedElement = event.target;
    const tableId = parseInt(clickedElement.getAttribute('data-table'));

    const table = clickedElement.classList.contains(classNames.booking.table); /*contains sprawdza czy element ma ()klase*/
    const tableBooked = clickedElement.classList.contains(classNames.booking.tableBooked);
    // const tableSelected = clickedElement.classList.contains(classNames.booking.tableSelected);

    if (table && tableBooked === false) { /*sprawdzam czy to jest stolik i czy nie jest zabookowany*/
      thisBooking.removeTableSelection();
      clickedElement.classList.add('selected'); /*dodaje klase selected jezeli warunek jest prawdziwy*/
      thisBooking.clickedTable = tableId; /*przypisuję numerek(tableId) do klikniętego elementu*/
    } else {
      alert('Stolik niedostępny!'); /*jezeli warunek nie jest prawdziwy, bedzie komunikat ze stolik jest zajety*/
    }

  }


  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.bookings;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.clickedTable,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      starters: [],
      phone: thisBooking.dom.bookingPhone.value,
      address: thisBooking.dom.bookingAddress.value,
    };
    for(let starter of thisBooking.dom.starters){
      if(starter.checked){
          payload.starters.push(starter.value);
      }
    }

    thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
    thisBooking.removeTableSelection();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);


  }





}


export default Booking;