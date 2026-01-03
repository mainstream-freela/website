import { HttpStatusCode } from "@angular/common/http";
import { Directive, inject } from "@angular/core";
import { PopUp, PopupStatus } from "@libraries/popup/popup.service";

@Directive()
export class HttpErrorCatcher {
    private alertService = inject(PopUp);
    connectionError(error: any): void{
        switch(error.status){
            case 0:
                this.alertService.add("Não foi possível manter a comunicação com o servidor", PopupStatus.ERROR)
                break;
    
            case HttpStatusCode.Forbidden:
                this.alertService.add(error.error.message, PopupStatus.ERROR);
                break;
            
            default:
                this.alertService.add("Não foi possível concluir com o teu pedido neste momento", PopupStatus.ERROR)
                break;
        }
    }
}