import {select, settings, templates, classNames} from '../settings.js';

class Home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
  }


  render(element){
    const thisHome = this;

    /*generuję kod HTML na podstawie szablonu */
    const generatedHTML = templates.homeWidget(element);

    //tworzę pusty obiekt
    thisBooking.dom = {};

    //dodaję do pustego obiektu własciwość wrapper i przupisuję referencję do kontenera
    thisBooking.dom.wrapper = element;

    //zmiana wartości wrappera innerHTML na kod wygenerowany z szablonu
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

  }

}