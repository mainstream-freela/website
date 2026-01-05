import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { ContentComponent } from "../views/content/content.component";
import { AboutFacade } from '@core/facades/about.facade';
import { AboutUs } from '@core/models/about-us.model';

@Component({
  selector: 'app-about-us',
  imports: [PageHeadComponent, ContentComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {

  aboutusFacade = inject(AboutFacade);
  aboutus: WritableSignal<AboutUs | null> = signal(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.getAboutUsContents();
  }

  private getAboutUsContents(): void{
    this.isLoading.set(true);
    this.aboutusFacade.aboutus().subscribe({
      next: (aboutus => {
        this.aboutus.set(aboutus);
        this.isLoading.set(false);
      })
    });
  }

}
