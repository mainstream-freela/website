import { Component } from '@angular/core';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { ContentComponent } from '../views/content/content.component';

@Component({
  selector: 'app-create-account',
  imports: [PageHeadComponent, ContentComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

}
