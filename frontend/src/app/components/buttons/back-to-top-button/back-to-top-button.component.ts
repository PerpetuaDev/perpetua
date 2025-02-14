import { Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-back-to-top-button',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './back-to-top-button.component.html',
  styleUrl: './back-to-top-button.component.scss'
})
export class BackToTopButtonComponent implements OnDestroy {
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
