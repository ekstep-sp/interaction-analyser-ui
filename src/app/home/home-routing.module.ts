import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { AuthenticationGuard } from '@app/auth';
import { SessionStatsComponent } from './session-stats/session-stats.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/sessions', pathMatch: 'full' },
    {
      path: 'sessions',
      component: HomeComponent,
      data: { title: marker('Sessions') },
      canActivate: [AuthenticationGuard],
    },
    {
      path: 'session-view',
      component: SessionDetailsComponent,
      data: { title: marker('Session View') },
      canActivate: [AuthenticationGuard],
    },
    {
      path: 'session-stats',
      component: SessionStatsComponent,
      data: { title: marker('Session Stats') },
      canActivate: [AuthenticationGuard],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
