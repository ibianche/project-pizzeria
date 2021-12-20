// import {settings} from "../settings";

class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;

  }

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;

  }


  set value(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    if ( newValue !== thisWidget.correctValue && thisWidget.isValid(newValue) ) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;

  }


  parseValue(value){  /*przekształca wartość na odpowiedni typ lub formę */
    return parseInt(value);
  }

  isValid(value){ /*sprawdza czy nowa wartość jest liczbą*/
    return !isNaN(value)
  }

  renderValue(){ /*wyswietla na stronie biezącą wartość widgetu*/
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce() {

    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }







}

export default BaseWidget;