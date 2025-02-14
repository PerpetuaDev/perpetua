import { Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-start-project-button',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './start-project-button.component.html',
  styleUrl: './start-project-button.component.scss'
})
export class StartProjectButtonComponent implements OnDestroy {
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
