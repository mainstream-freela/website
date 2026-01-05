import { Directive, InputSignal } from "@angular/core";
import { AbstractControl, ControlValueAccessor } from "@angular/forms";

@Directive()
export abstract class BaseFormFieldComponent<T = any> implements ControlValueAccessor{

    public value!: T;
    public disabled: boolean = false;

    protected onChange: (value: T) => void = () => {};
    protected onTouched: () => void = () => {};

    formControl!: InputSignal<AbstractControl>;

    writeValue(value: T): void {
        this.value = value;
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
    
    markedAsTouched(): void{
        this.onTouched();
    }

    get isInvalid() {
        return this.formControl()?.invalid && (this.formControl()?.dirty || this.formControl()?.touched);
    }

}