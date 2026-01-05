import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { TicketComponent } from "../views/ticket/ticket.component";
import { BookTicketComponent } from "../views/book-ticket/book-ticket.component";
import { CheckoutService } from '@libraries/checkout/checkout.service';
import { Router } from '@angular/router';
import { TicketPurchaser } from '@core/models/purchaser.model';
import { PurchaseTicket } from '@core/api/purchase.api.service';
import { PopUp, PopupStatus } from '@libraries/popup/popup.service';
import { HttpStatusCode } from '@angular/common/http';
import { DialogComponent } from '@shared/components/dialog/dialog.component';

@Component({
  selector: 'app-checkout',
  imports: [PageHeadComponent, TicketComponent, BookTicketComponent, DialogComponent],
  providers: [ PurchaseTicket ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutService = inject(CheckoutService);
  router = inject(Router);
  purchaseService = inject(PurchaseTicket);
  popup = inject(PopUp);
  openDialog = signal<boolean>(false);

  checkouts = computed(() => this.checkoutService.checkouts());
  error404 = signal(false);
  
  isPurchasingTicket = signal(false);
  purchaseCompleted = signal(false);

  ngOnInit(): void {
    this.getCheckout();
  }

  private getCheckout(): void{
    if(!(this.checkoutService.checkouts().length > 0)){
      this.error404.set(true);
      
    } else {
      this.error404.set(false);
    }
  }

  purchaseTicket(ticketPurchaser: TicketPurchaser): void{

    this.isPurchasingTicket.set(true);
    this.purchaseService.purchaseTicket(ticketPurchaser, this.checkouts()[0]).subscribe({
      next: (response) => {
        if(response.status === HttpStatusCode.NoContent){
            // this.popup.add("Seu pedido foi concluído com êxito. Entraremos em contacto pela via escolhida.", PopupStatus.SUCCESS);
            this.openDialog.set(true);
            this.purchaseCompleted.set(true);
        }
        this.isPurchasingTicket.set(false);
      },
      error: (error) => {
        if(error.status === HttpStatusCode.UnprocessableEntity){
          // const messages: string[] = [];

          for (const key in error.error.errors) {
            if (error.error.errors[key] && Array.isArray(error.error.errors[key])) {
              // messages.push(...error.error.errors[key]);
              this.popup.add(error.error.errors[key][0], PopupStatus.ERROR);
            }
          }
        } else {
          this.popup.add(error.error.message, PopupStatus.ERROR);          
        } 
        this.isPurchasingTicket.set(false);
      }
    });
  }

}
