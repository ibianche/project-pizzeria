import {select, settings, templates, classNames} from '../settings.js';
import { app } from '../app.js';



class Home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.activePage();
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

    thisHome.dom.orderOnline = document.querySelector(select.home.orderOnline);
    thisHome.dom.bookTable = document.querySelector(select.home.bookTable);



    const slider = tns({
      container: '.my-slider',
      slideBy: 'page',
      mouseDrag: true,
      controls: false,
      autoplay: true,
      autoplayButtonOutput: false,
      nav: false,
    });

  }

  activePage(){
    const thisHome = this;

    thisHome.dom.orderOnline.addEventListener('click', function () {
      app.activatePage('order');
    });

    thisHome.dom.bookTable.addEventListener('click', function () {
      app.activatePage('booking');
    });
  }



}

export default Home;