import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems :CartItem[]=[];

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'))
    if(data !=null){
      this.cartItems = data
      this.computeCartTotals()
    }
   }

  addToCart(theCartItem:CartItem){
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length>0){
        existingCartItem = this.cartItems.find(
          tempCartItem => tempCartItem.id === theCartItem.id
        )
        alreadyExistInCart = (existingCartItem != undefined)
    }

    if(alreadyExistInCart){
        existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem)
    }

    this.computeCartTotals()
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0 ){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals()
    }

  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1)
      this.computeCartTotals();
    }

  }
  computeCartTotals() {
    let totalPriceValue:number = 0;
      let totalQuantityValue:number = 0;

      for(let currentCartItem of this.cartItems){
        totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
        totalQuantityValue +=currentCartItem.quantity;
      }
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);
      this.logData(totalPriceValue,totalQuantityValue)
      this.persistCartItems()
  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems))
  }

  logData(totalPriceVaue:number,totalQuantityValue:number) {
    for(let cartItem of this.cartItems){
      console.log(cartItem)
    }
    console.log(`total : ${totalPriceVaue.toFixed(2)} , quantity : ${totalQuantityValue}`)
  }
}
