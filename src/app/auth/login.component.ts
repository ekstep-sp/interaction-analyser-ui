import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from '@app/@shared';
import { CredentialsService } from './credentials.service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private credentialsService: CredentialsService
  ) {
    this.createForm();
    if (this.credentialsService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }
  subscription: any;
  alertsDismiss: any = [];
  ngOnInit() {
    this.subscription = this.notificationService.onNotificationEvent().subscribe((item) => (this.alertsDismiss = item));
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.auth(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (context: any) => {
          log.debug(context);
          log.debug(`${JSON.stringify(context)} successfully logged in`);
          if (context.user) {
            this.credentialsService.setCredentials(context, true);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/']);
          }
          ///
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
