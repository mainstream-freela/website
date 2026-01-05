import { NgClass } from '@angular/common';
import { Component, ElementRef, input, OnChanges, OnInit, output, signal, SimpleChanges, viewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod } from '@core/enums/payment-method.enum';
import { ReceiveTicicketDetailsOPtions } from '@core/enums/receive-ticket-details-options.enum';
import { TicketPurchaser } from '@core/models/purchaser.model';
import { mimeTypeValidator } from '@core/validators/file-mime.validator';
import { FileInputComponent } from '@shared/components/file-input/file-input.component';
import { SizeConverterPipe } from '@shared/pipes/size-converter.pipe';
import { CopyToClipboardUi } from "@shared/ui/copy-to-clipboard.ui";

@Component({
  selector: 'app-book-ticket',
  imports: [ReactiveFormsModule, NgClass, CopyToClipboardUi, SizeConverterPipe],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css'
})
export class BookTicketComponent implements OnInit, OnChanges {
  receiveOptionsEnum = ReceiveTicicketDetailsOPtions;
  paymentMethodsEnum = PaymentMethod;
  selectedOption: WritableSignal<ReceiveTicicketDetailsOPtions> = signal(this.receiveOptionsEnum.EMAIL);
  selectedPaymentMethod: WritableSignal<PaymentMethod> = signal(this.paymentMethodsEnum.PAYPAY_APP);
  purchaseTicketFormGroup!: FormGroup;

  maxSizeLimit: number = 105 * 1024;

  formIsInvalid = signal<boolean>(false);

  purchaseFormDateEventEmitter = output<TicketPurchaser>();
  isPurchasingTicket = input.required<boolean>();
  purchaseCompleted = input.required<boolean>();

  proofFileInput = viewChild<ElementRef<FileInputComponent>>('proofFileInput');
  selectedProofOfPayment: File | null = null;

  ngOnInit(): void {
    this.purchaseTicketFormGroup = new FormGroup({
      'name': new FormControl('', [ Validators.required ]),
      'email': new FormControl('', [ Validators.required, Validators.email ]),
      'address': new FormControl('', [ Validators.required ]),
      'contact': new FormControl('', [ Validators.required ]),
      'proof-of-transfer': new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.purchaseCompleted()){
      this.purchaseTicketFormGroup.reset();
    }
  }

  changePaymentMethod(method: PaymentMethod): void{
    this.selectedPaymentMethod.set(method);

    const proofControl = this.purchaseTicketFormGroup.get('proof-of-transfer');
    if(method === PaymentMethod.REFERENCE){
      proofControl?.setValidators([
        Validators.required,
        mimeTypeValidator(['application/pdf'])
      ]);
    } else {
      proofControl?.clearValidators();
      proofControl?.setValue(null);
      proofControl?.markAsPristine();
      proofControl?.markAsUntouched();
    }
    proofControl?.updateValueAndValidity();
  }

  onProofFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    if(!file){
      this.selectedProofOfPayment = null;
      return;
    }

    const maxSize = this.maxSizeLimit;

    if(file.size > maxSize) {
      this.selectedProofOfPayment = null;
      this.purchaseTicketFormGroup.get('proof-of-transfer')?.setErrors({ oversized: true });
      return;
    }

    this.purchaseTicketFormGroup.get('proof-of-transfer')?.setValue(file);
    this.selectedProofOfPayment = file;
  }

  changeOption(option: ReceiveTicicketDetailsOPtions){
    this.selectedOption.set(option);
  }

  submit(): void{
    if(this.formIsInvalid()){
      return;
    }
    
    const ticketPurchaser: TicketPurchaser = {
      name: this.purchaseTicketFormGroup.get('name')?.value,
      email: this.purchaseTicketFormGroup.get('email')?.value,
      address: this.purchaseTicketFormGroup.get('address')?.value,
      contact: this.purchaseTicketFormGroup.get('contact')?.value,
      option: this.selectedOption(),
      payment_method: this.selectedPaymentMethod(),
      payment_proof: this.selectedProofOfPayment ?? undefined
    }
    this.purchaseFormDateEventEmitter.emit(ticketPurchaser);
  }

}
