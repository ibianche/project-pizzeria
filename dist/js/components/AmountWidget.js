import {select, settings, } from '../settings.js';
// import { utils } from '../utils.js';
import BaseWidget from './BaseWidget.js';



class AmountWidget extends BaseWidget{   /*extends oznaczą że AmountWidget jest rozszerzeniem klasy BaseWidget*/
  constructor(element) {
    super(element, settings.amountWidget.defaultValue ); /*super oznacza wywołanie konstruktora klasy BaseWidget*/

    const thisWidget = this;

    thisWidget.getElements(element);
    // thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);
    thisWidget.initActions();


    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor arguments:', element);

  }

  getElements() {
    const thisWidget = this;

    // thisWidget.dom.wrapper = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }





  isValid(value){ /*zwraca true lub false w zależności czy wartość jest prawidłowa według kryteriów które ustawimy dla widgetu*/
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){ /*wyswietla na stronie biezącą wartość widgetu*/
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }



  initActions() {

    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      // thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });

  }




}

export default AmountWidget;