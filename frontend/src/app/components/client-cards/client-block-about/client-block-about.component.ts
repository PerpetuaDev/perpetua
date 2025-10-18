// Libraries
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
// Services
import { IClient } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-client-block-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './client-block-about.component.html',
  styleUrl: './client-block-about.component.scss'
})
export class ClientBlockAboutComponent implements OnDestroy {
  @Input() clients: IClient[] = [];
  currentLanguage: string = 'en';
  isMobile$!: Observable<boolean>;

  constructor(
    private translationHelper: TranslationHelper,
    private breakpoint: BreakpointObserver,
    private router: Router,
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.isMobile$ = this.breakpoint.observe([Breakpoints.Handset]).pipe(
      map(res => res.matches),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  emptySpaces(target: number): any[] {
    const needed = Math.max(target - this.clients.length, 0);
    return Array(needed).fill(null);
  }

  goToClients(): void {
    const currentPath = this.router.url.split('?')[0];
    if (currentPath === '/clients') {
      this.router.navigate(['/clients/all']);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}
