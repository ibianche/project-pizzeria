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

  }

}