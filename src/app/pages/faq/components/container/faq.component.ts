import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { ContentComponent } from '../views/content/content.component';
import { Faq } from '@core/models/about-us.model';
import { AboutFacade } from '@core/facades/about.facade';

@Component({
  selector: 'app-faq',
  imports: [PageHeadComponent, ContentComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {

  faqs: WritableSignal<Faq[]> = signal([]);
  isLoading = signal<boolean>(true);
  hasErrors = signal<boolean>(true);
  aboutusFacade = inject(AboutFacade);

  ngOnInit(): void {
    this.getFaqs();
  }

  private getFaqs(): void{
    this.isLoading.set(true);
    this.aboutusFacade.faqs().subscribe({
      next: response => {
        this.faqs.set(response)
        this.isLoading.set(false);
        this.hasErrors.set(false);
      },
      error: err => {
        this.isLoading.set(false)
        this.hasErrors.set(true);
      }
    });
  }

}
