import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Angulartics2Module } from 'angulartics2';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AppAsideModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
  AppBreadcrumbModule,
} from '@coreui/angular';
import { IconModule, IconSetModule } from '@coreui/icons-angular';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionStatsComponent } from './session-stats/session-stats.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    Angulartics2Module,
    HomeRoutingModule,
    AppAsideModule,
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
    PerfectScrollbarModule,
    FormsModule,
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot({}),
  ],
  declarations: [HomeComponent, SessionDetailsComponent, SessionStatsComponent],
})
export class HomeModule {}
