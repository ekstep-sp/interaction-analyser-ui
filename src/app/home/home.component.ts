import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { QuoteService } from './quote.service';
import { SessionService } from './session.service';
import { Logger } from '@app/@core/logger.service';
import { ActivatedRoute, Router } from '@angular/router';

const log = new Logger('Login');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sessionList: any = [];
  isGridView = true;

  constructor(private sessionService: SessionService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const listContext = {
      limit: 1000,
      page: 1,
    };
    const login$ = this.sessionService.getSessionsList(listContext);
    login$.pipe().subscribe(
      (context: any) => {
        log.debug(context);
        log.debug(`${JSON.stringify(context)}`);
        this.sessionList = context.results;
      },
      (error) => {
        log.debug(`Login error: ${error}`);
        //this.error = error;
      }
    );
  }

  viewSessionDetails(index: number) {
    this.setSessionContext(index);
    this.router.navigate(['/session-view']);
  }

  viewSessionStats(index: number) {
    this.setSessionContext(index);
    this.router.navigate(['/session-stats']);
  }

  setSessionContext(index: number) {
    this.sessionService.setCurrentSessionContext(this.sessionList[index]);
  }
}
