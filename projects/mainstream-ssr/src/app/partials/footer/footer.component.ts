import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-footer',
    imports: [ RouterLink ],
    styleUrl: './footer.component.css',
    templateUrl: './footer.component.html',
    standalone: true,
})
export class FooterComponent{

}