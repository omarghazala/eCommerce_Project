import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

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
  constructor(private formBuilder:FormBuilder,private shopFormService:ShopFormService ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress : this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      billingAddress : this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      creditCard : this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
      })
    })

    // populate months and years
    const startMonth:number = new Date().getMonth();
    console.log(startMonth)

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("card months : "+ JSON.stringify(data))
        this.creditCardMonths = data
      }
    )

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("card years : "+ JSON.stringify(data))
        this.creditCardYears = data
      }
    )

    this.shopFormService.getCountries().subscribe(
      data=>{
        this.countries = data
      }
    )
  }

  onSubmit(){
    console.log("Handling submit button")
    console.log(this.checkoutFormGroup.get('customer').value)
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
        console.log("card months : "+ JSON.stringify(data))
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
