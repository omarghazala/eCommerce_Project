import { Product } from "./product";

export class CartItem {
    id:string;
    name:string;
    imageUrl:string;
    quantity:number;
    unitPrice:number;

    constructor(product:Product){
        this.id = product.id;
        this.name= product.name;
        this.imageUrl = product.imageUrl;
        this.quantity = 1;
        this.unitPrice = product.unitPrice;
    }
}
