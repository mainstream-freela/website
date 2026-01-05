import { PaymentMethod } from "@core/enums/payment-method.enum";
import { ReceiveTicicketDetailsOPtions } from "@core/enums/receive-ticket-details-options.enum";

export interface TicketPurchaser{
    name: string,
    email: string,
    address: string,
    contact: string,
    option: ReceiveTicicketDetailsOPtions,
    payment_method: PaymentMethod,
    payment_proof?: File
}