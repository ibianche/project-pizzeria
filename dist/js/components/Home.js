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
    thisHome.dom = {};

    //dodaję do pustego obiektu własciwość wrapper i przupisuję referencję do kontenera
    thisHome.dom.wrapper = element;

    //zmiana wartości wrappera innerHTML na kod wygenerowany z szablonu
    thisHome.dom.wrapper.innerHTML = generatedHTML;

  }

}

export default Home;