// import {utils} from "../utils.js";
import {select, classNames, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
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

  }

  initWidgets() {
    const thisBooking = this;
    //tworzę nową instancje AmountWidget
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function () {

    });
    //tworzę nową instancje AmountWidget
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function () {

    });


  }


}


export default Booking;