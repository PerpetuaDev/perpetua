// Libraries
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { PageListComponent } from './components/page-list/page-list.component';
import { LanguageFooterComponent } from '../languages/language-footer/language-footer.component';
// Services
import { TranslationHelper } from '../../shared/translation-helper';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContactInfoComponent,
    PageListComponent,
    LanguageFooterComponent,
    TranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnDestroy {
  currentLanguage: string = 'en';

  constructor(private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
