import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AdvertiserApiService } from '@core/api/advertiser.api.service';
import { CreateAdvertiserContract } from '@core/contracts/create-advertiser.contract';
import { PopUp, PopupStatus } from '@libraries/popup/popup.service';
import { DialogComponent } from '@shared/components/dialog/dialog.component';

@Component({
  selector: 'app-content',
  imports: [ ReactiveFormsModule, NgClass, DialogComponent ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  advertiserClient = inject(AdvertiserApiService);

  becomeAdvertiserFormGroup!: FormGroup;
  formIsInvalid = signal(false);
  isCreatingAdvertiser = signal(false);
  popup = inject(PopUp);
  
  openDialog = signal<boolean>(false);

  passwordCriteria = {
    minLength: false,
    hasLetters: false,
    hasNumber: false,
    hasSymbols: false
  }

  ngOnInit(): void {
    this.becomeAdvertiserFormGroup = new FormGroup({
      'name': new FormControl('', [ Validators.required ]),
      'email': new FormControl('', [ Validators.required, Validators.email ]),
      'password': new FormControl('', [ Validators.required, Validators.minLength(8) ]),
      'password_confirmation': new FormControl('', [ Validators.required, Validators.minLength(8) ])
    }, { validators: this.passwordsMatchValidator });

    this.becomeAdvertiserFormGroup.get('password')?.valueChanges.subscribe((password: any) => {
        if(!password) return;
        this.passwordCriteria = {
          minLength: password.length >= 8,
          hasLetters: /[a-zA-Z]/.test(password),
          hasNumber: /\d/.test(password),
          hasSymbols: /[@$!%*?&#]/.test(password)
        }
        this.validatePasswordCriterias();
      })

  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null
  {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  validatePasswordCriterias(){
    if(
      !this.passwordCriteria.minLength      ||
      !this.passwordCriteria.hasLetters     ||
      !this.passwordCriteria.hasNumber      ||
      !this.passwordCriteria.hasSymbols
    ){
      this.becomeAdvertiserFormGroup.get('password')?.setErrors({ });
    }
  }

  private validate(){
    if(this.becomeAdvertiserFormGroup.invalid){
      this.formIsInvalid.set(true);
    } else {
      this.formIsInvalid.set(false);
    }
  }

  submit(){

    this.validate();
    if(this.formIsInvalid()){
      return;
    }

    let advertiser: CreateAdvertiserContract = {
      name: this.becomeAdvertiserFormGroup.get('name')?.value,
      email: this.becomeAdvertiserFormGroup.get('email')?.value,
      password: this.becomeAdvertiserFormGroup.get('password')?.value,
      password_confirmation: this.becomeAdvertiserFormGroup.get('password_confirmation')?.value
    };

    this.isCreatingAdvertiser.set(true);
    this.advertiserClient.create(advertiser).subscribe({
      next: (response) => {
        if(response.status === HttpStatusCode.Created)
          // this.popup.add("Conta de anunciante criada com êxito.", PopupStatus.SUCCESS);
          this.openDialog.set(true);
          this.isCreatingAdvertiser.set(false)
          this.becomeAdvertiserFormGroup.reset();
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
        }
        this.isCreatingAdvertiser.set(false)
      }
    });

  }

}
