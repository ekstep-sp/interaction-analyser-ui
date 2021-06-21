import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { MockAuthenticationService } from '@app/auth/authentication.service.mock';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';

import { I18nModule } from '@app/i18n';
import { ShellComponent } from './shell.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderModule, AppFooterModule, AppSidebarModule, AppBreadcrumbModule } from '@coreui/angular';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          I18nModule,
          NgbModule,
          CoreModule,
          AppHeaderModule,
          AppFooterModule,
          AppSidebarModule,
          IconModule,
          IconSetModule,
          BsDropdownModule.forRoot(),
          TabsModule.forRoot(),
          ChartsModule,
          AppBreadcrumbModule.forRoot(),
          IconSetModule.forRoot(),
        ],
        providers: [
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: CredentialsService, useClass: MockCredentialsService },
          IconSetService,
        ],
        declarations: [ShellComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
