import { Injectable, signal, WritableSignal } from "@angular/core";
import { CheckoutContract } from "@core/contracts/checkout.contract";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService{
    public readonly checkouts: WritableSignal<CheckoutContract[]> = signal([]);

    public addItem(item: CheckoutContract): void {
        const current = this.checkouts();
        
        // Verifica se já existe pelo UUID (evita duplicado)
        // const exists = current.some(existing => existing.ticket.uuid === item.ticket.uuid);
        // if (!exists) {
        //     this.checkouts.set([...current, item]);
        // }
        this.checkouts.set([item]);
    }

    public removeItem(item: CheckoutContract): void {
        const updated = this.checkouts().filter(existing => existing.ticket.uuid !== item.ticket.uuid);
        this.checkouts.set(updated);
    }
    
    // Adiciona ou aumenta a quantidade
    public incrementItem(item: CheckoutContract): void {
        const current = this.checkouts();
        const index = current.findIndex(i => i.ticket.uuid === item.ticket.uuid);

        if (index !== -1) {
            const updatedItem = { ...current[index], quantity: current[index].quantity + 1 };
            const updated = [...current];
            updated[index] = updatedItem;
            this.checkouts.set(updated);
        } else {
            this.checkouts.set([...current, { ...item, quantity: 1 }]);
        }
    }

    // Diminui a quantidade ou remove se for 1
    public decrementItem(item: CheckoutContract): void {
        const current = this.checkouts();
        const index = current.findIndex(i => i.ticket.uuid === item.ticket.uuid);

        if (index !== -1) {
            const existing = current[index];
            if (existing.quantity > 1) {
                const updatedItem = { ...existing, quantity: existing.quantity - 1 };
                const updated = [...current];
                updated[index] = updatedItem;
                this.checkouts.set(updated);
            } else {
                // Remove o item se quantidade for 1
                const updated = current.filter(i => i.ticket.uuid !== item.ticket.uuid);
                this.checkouts.set(updated);
            }
        }
    }

}