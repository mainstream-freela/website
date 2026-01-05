import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-head',
  imports: [ RouterLink, NgClass ],
  template: `
    <div class="section-content py-16 bg-[#FFECF0]">
      <div class="limited-container flex flex-col gap-12">
        <div class="breadcrumbs">
          @for (breadcrumb of breadcrumbs(); track $index) {
            <a [routerLink]="breadcrumb.route ?? null" [ngClass]="{ '!font-bold !text-(color:--primary)': breadcrumb.route }" class="!font-['Montserrat'] text-xs font-medium">{{ breadcrumb.name }}</a>
            @if (!$last) {
              <span class="mx-4 !font-['Montserrat'] text-xs font-medium"> / </span>
            }
          }
        </div>
        <div class="content">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class PageHeadComponent {
  breadcrumbs = input.required<any[]>();
}
