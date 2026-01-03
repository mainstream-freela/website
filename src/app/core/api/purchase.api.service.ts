import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CheckoutContract } from "@core/contracts/checkout.contract";
import { TicketPurchaser } from "@core/models/purchaser.model";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable()
export class PurchaseTicket extends HttpErrorCatcher{

    constructor (private http: HttpClient) {
        super();
    }
    
    purchaseTicket(ticketPurchaser: TicketPurchaser, checkout: CheckoutContract): Observable<any>{
        const purchaseJson = {
            ...ticketPurchaser,
            quantity: checkout.quantity
        }

        const purchaseFormData = new FormData();
        purchaseFormData.append('name', ticketPurchaser.name);
        purchaseFormData.append('email', ticketPurchaser.email);
        purchaseFormData.append('address', ticketPurchaser.address);
        purchaseFormData.append('contact', ticketPurchaser.contact);
        purchaseFormData.append('option', ticketPurchaser.option);
        purchaseFormData.append('payment_method', ticketPurchaser.payment_method);
        purchaseFormData.append('quantity', checkout.quantity.toString());

        if(ticketPurchaser.payment_proof){
            purchaseFormData.append('payment_proof', ticketPurchaser.payment_proof);
        }

        return this.http.post(`${environment.server}/api/v1/client/purchase/ticket/${checkout.ticket.uuid}`, purchaseFormData, { observe: 'response' }).pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }

}