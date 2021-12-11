import {select, classNames, templates} from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';



class Product {

  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();

    thisProduct.initOrderForm();

    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // console.log('new Product:', thisProduct);
  }

  renderInMenu() {

    const thisProduct = this;

    /* generated HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);

  }


  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);

    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

  }


  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: add event listener to clickable trigger on event click */
    // clickableTrigger.addEventListener('click', function(event) {
    thisProduct.accordionTrigger.addEventListener('click', function (event) {


      /* prevent default action for event */
      event.preventDefault();


      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);


      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct != thisProduct.element && activeProduct != null) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }


      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);


    });
  }

  initOrderForm() {
    const thisProduct = this;
    // console.log('test');
    // console.log(this.initOrderForm);

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });


  };


  processOrder() {
    const thisProduct = this;
    // console.log('test2');
    // console.log(this.processOrder);

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData', formData);

    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // console.log(paramId, param);
      //
      // console.log('szukam');
      // console.log(param.options);


      // for every option in this category
      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        // console.log(optionId, option);


        // check if there is param with a name of paramId in formData and if it includes optionId
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {


          // check if the option is not default
          if (!option.default) {

            // add option price to price variable
            price = price + option.price;

            // thisProduct.imageWrapper.classList.remove(classNames.menuProduct.imageVisible);

          }

        } else {

          // check if the option is default
          if (option.default) {

            // reduce price variable
            price = price - option.price;

            // thisProduct.imageWrapper.classList.add(classNames.menuProduct.imageVisible);
          }
        }


        const pizzaImage = thisProduct.imageWrapper.querySelector("." + paramId + "-" + optionId);
        // console.log('test 3');
        // console.log(pizzaImage);
        if (pizzaImage) {
          if (optionSelected) {

            pizzaImage.classList.add(classNames.menuProduct.imageVisible);

          } else {

            pizzaImage.classList.remove(classNames.menuProduct.imageVisible);

          }
        }
      }
    }

    thisProduct.priceSingle = price;

    price *= thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = price;


  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function () {

      thisProduct.processOrder()

    });

  }


  addToCart() {

    const thisProduct = this;

    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);

  }


  prepareCartProduct() {

    const thisProduct = this;

    const productSummary = {};

    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.priceSingle = thisProduct.priceSingle;
    productSummary.price = productSummary.priceSingle * productSummary.amount;
    productSummary.params = thisProduct.prepareCartProductParams();


    // productSummary.params = {};

    return productSummary;
  }

  prepareCartProductParams() {

    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      params[paramId] = {
        label: param.label,
        options: {}
      }

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;

  }
}


export default Product;