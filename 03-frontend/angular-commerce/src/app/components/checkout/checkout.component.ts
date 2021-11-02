import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  checkoutFormGroup: FormGroup;
  constructor(private formBuilder:FormBuilder,private shopFromService:ShopFormService ) { }

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

    this.shopFromService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("card months : "+ JSON.stringify(data))
        this.creditCardMonths = data
      }
    )

    this.shopFromService.getCreditCardYears().subscribe(
      data => {
        console.log("card years : "+ JSON.stringify(data))
        this.creditCardYears = data
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
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
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

    this.shopFromService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("card months : "+ JSON.stringify(data))
        this.creditCardMonths = data
      }
    )
  }
}
