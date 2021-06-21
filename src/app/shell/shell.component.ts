import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/@shared';
import { CredentialsService } from '@app/auth';
import { navItems } from '../_nav';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  subscription: any;
  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private router: Router
  ) {}
  toggleMinimize(e: any) {
    this.sidebarMinimized = e;
  }
  alertsDismiss: any = [];
  ngOnInit() {
    this.subscription = this.notificationService.onNotificationEvent().subscribe((item) => (this.alertsDismiss = item));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  logout() {
    this.credentialService.resetCredentials();
    this.router.navigate(['/login']);
  }
}
