import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@partials/header/header.component';
import { FooterComponent } from "./partials/footer/footer.component";
import { isPlatformBrowser, NgClass } from '@angular/common';
import { PopUp, PopupStatus } from '@libraries/popup/popup.service';
import * as AOS from "aos";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  popupStatus = PopupStatus;
  log = inject(PopUp);
  
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if(!isPlatformBrowser(this.platformId)) return;
    AOS.init({
      offset: 200,
      duration: 900,
      easing: 'ease-in-out-cubic',
      delay: 0,
      once: true
    });

    setTimeout(() => {
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    }, 200);
  }
}
