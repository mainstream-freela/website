import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@seller-backoffice-core/entities/user.entity';
import { UserService } from '@seller-backoffice-core/services/user.service';
import { PopUp, PopupStatus } from '@seller-backoffice-core/libs/popup/popup.service';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [],
  template: `
    <div class="h-dvh flex flex-col justify-center items-center gap-4 bg-gray-50">
      <img src="/logo.svg" class="h-9 mb-2" alt="">
      <div class="flex items-center gap-3">
        <svg class="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 font-semibold">A autenticar no Studio...</span>
      </div>
    </div>
  `,
  styles: ``
})
export class SSOPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private alertService = inject(PopUp);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const eventUuid = params['event'];
      const email = params['email'];
      const name = params['name'];

      if (token && eventUuid && email && name) {
        // Save user session details in local storage
        window.localStorage.setItem('mainstream__user_token', token);
        window.localStorage.setItem('mainstream__user_email', email);
        window.localStorage.setItem('mainstream__user_name', name);

        // Update current session user state
        const user = new User();
        user.create(name, email, token);
        this.userService.setUser(user);

        // Check redirect_to parameter
        const redirectTo = params['redirect_to'] || 'stream';
        if (redirectTo === 'report') {
          this.router.navigate(['/my-account/events', eventUuid, 'report']);
        } else {
          // Default: Navigate directly to the events list page with the start_live query parameter
          this.router.navigate(['/my-account/events'], { queryParams: { start_live: eventUuid } });
        }
      } else {
        this.alertService.add("Erro na autenticação SSO: Parâmetros em falta.", PopupStatus.ERROR);
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
