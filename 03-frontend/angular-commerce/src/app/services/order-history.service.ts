import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.ghazalashopApiUrl+'/orders';

  constructor(private httpClient:HttpClient) { }

  getOrderHistory(userEmail:string):Observable<GetResponseOrderHistory>{
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;
    console.log(orderHistoryUrl);
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded:{
    orders:OrderHistory[]
  }
}
