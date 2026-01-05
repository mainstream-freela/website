import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { ContentComponent } from '../views/content/content.component';
import { AboutFacade } from '@core/facades/about.facade';
import { AboutUs } from '@core/models/about-us.model';
import { ErrorMessageUi } from '@shared/ui/error-message.ui';

@Component({
  selector: 'app-contact-us',
  imports: [PageHeadComponent, ContentComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {

  aboutusFacade = inject(AboutFacade);
  aboutus: WritableSignal<AboutUs | null> = signal(null);
  isLoading = signal<boolean>(true);
  hasErrors = signal<boolean>(true);

  ngOnInit(): void {
    this.getAboutUsContents();
  }

  private getAboutUsContents(): void{
    this.isLoading.set(true);
    this.aboutusFacade.aboutus().subscribe({
      next: (aboutus => {
        this.aboutus.set(aboutus);
        this.isLoading.set(false);
        this.hasErrors.set(false);
      }),
      error: error => {
        this.hasErrors.set(true);
      }
    });
  }

}
