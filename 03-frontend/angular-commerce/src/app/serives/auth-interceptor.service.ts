import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private oktaAuthService:OktaAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAcess(request,next));
  }

  private async handleAcess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>>{
    const securedEndPoints = ['http://localhost:8080/api/orders']

    if(securedEndPoints.some(url => request.urlWithParams.includes(url))){
      const accessToken = await this.oktaAuthService.getAccessToken();

      request = request.clone({
        setHeaders:{
          Authorization: 'Bearer '+ accessToken
        }
      });

    }
    return next.handle(request).toPromise();

  }
}
