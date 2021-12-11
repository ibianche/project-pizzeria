import {select, classNames, templates, settings} from '../settings.js';
import { utils } from '../utils.js';
import CartProduct from './CartProduct.js';


class Cart {
  constructor(element) {

    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);

    thisCart.initAction();

    // console.log('new Cart', thisCart);
  }

  getElements(element) {

    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);

    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);

    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);

    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);

    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);

  }

  initAction() {

    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {

      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

    });

    thisCart.dom.productList.addEventListener('updated', function () {

      thisCart.update();

    });

    thisCart.dom.productList.addEventListener('remove', function () {

      thisCart.remove(event.detail.cartProduct);

    });

    thisCart.dom.form.addEventListener('submit', function (event) {

      event.preventDefault();
      thisCart.sendOrder();

    })

  }

  add(menuProduct) {

    const thisCart = this;

    console.log('adding product', menuProduct);

    /* generated HTML based on template*/
    const generatedHTML = templates.cartProduct(menuProduct);
    // console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to menu */
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);

    thisCart.update();

  }

  update() {

    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;

    thisCart.subtotalPrice = 0;

    for (let cartProduct of thisCart.products) {

      thisCart.totalNumber = thisCart.totalNumber + cartProduct.amount;
      thisCart.subtotalPrice = thisCart.subtotalPrice + cartProduct.price;
    }

    if (thisCart.totalNumber !== 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      console.log(thisCart.totalPrice);
    } else {
      thisCart.totalPrice = thisCart.subtotalPrice;
      console.log(thisCart.totalPrice);
    }

    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    for (let totalPrice of thisCart.dom.totalPrice) {
      totalPrice.innerHTML = thisCart.totalPrice;
    }
    ;


  }

  remove(cartProduct) {
    const thisCart = this;

    cartProduct.dom.wrapper.remove();

    let indexElement = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(indexElement, 1);

    thisCart.update();


  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    console.log('test', payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    ;

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

export default Cart;