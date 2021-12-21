import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice:number = 0;
  totalQuantity:number = 0;

  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];

  countries:Country[];
  states:State[];

  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];

  checkoutFormGroup: FormGroup;

  storage:Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo:PaymentInfo = new PaymentInfo();
  cardElement:any;
  displayError:any="";

  isDisabled: boolean = false;

  constructor(private formBuilder:FormBuilder,
              private shopFormService:ShopFormService,
              private cartService:CartService,
              private checkoutService:CheckoutService,
              private router:Router ) { }

  ngOnInit(): void {

    this.setupStripePaymentForm();

    this.reviewCartDetails();

    const email = JSON.parse(this.storage.getItem('email'))

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        email:new FormControl(email,[Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
      }),
      billingAddress : this.formBuilder.group({
        street:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
      })
      // ,
      // creditCard : this.formBuilder.group({
      //   cardType:new FormControl('',[Validators.required]),
      //   nameOnCard:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.noOnlyWhiteSpaces]),
      //   cardNumber:new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
      //   securityCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
      //   expirationMonth:new FormControl('',[Validators.required]),
      //   expirationYear:new FormControl('',[Validators.required]),
      // })
    })

    this.shopFormService.getCountries().subscribe(
      data=>{
        this.countries = data
      }
    )

    
 

    // populate months and years
    /*const startMonth:number = new Date().getMonth();

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    )

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data
      }
    )*/

    
  }

  reviewCartDetails(){
    this.cartService.totalPrice.subscribe(
      data =>{
        this.totalPrice = data;
      }
    )

    this.cartService.totalQuantity.subscribe(
      data =>{
        this.totalQuantity = data;
      }
    )
  }

  setupStripePaymentForm(){
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card',{ hidePostalCode: true});
    this.cardElement.mount('#card-element');
    this.cardElement.on('change',(event)=>{
      // get handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if(event.complete){
        this.displayError.textContent = "";
      }
      else{
        this.displayError.textContent = event.error.message;
        
      }
    });
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  

  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    let order = new Order();
    order.totalPrice = this.totalPrice
    order.totalQuantity = this.totalQuantity

    const cartItems = this.cartService.cartItems;
    let orderItems:OrderItem[]=cartItems.map(tempCartItem=>new OrderItem(tempCartItem))

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order
    purchase.orderItems = orderItems

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency= "USD"
    console.log(this.paymentInfo);
    // if valid form - create payment intent - confirm card payment - place order
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address:{
                    city: purchase.billingAddress.city,
                    line1: purchase.billingAddress.street,
                    postal_code: purchase.billingAddress.zipCode,
                    state: purchase.billingAddress.state,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false })
          .then(function(result) {
            if (result.error) {
              // inform the customer there was an error
              this.isDisabled = false;
              alert(`There was an error: ${result.error.message}`);
            } else {
              // call REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: err => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })
            }            
          }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products")
  }

  copyShippingAddresstoBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFomGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear()
    const selectedYear: number = Number(creditCardFomGroup.value.expirationYear)
    let startMonth: number;

    if(currentYear===selectedYear){
      startMonth = new Date().getMonth();
    }
    else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    )
  }
  getStates(formGroupName:string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code
    const countryName = formGroup.value.country.name

    this.shopFormService.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName==='shippingAddress'){
          this.shippingAddressStates = data;
        }
        else if(formGroupName==='billingAddress'){
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0])
      }
    );

    

  }
}
