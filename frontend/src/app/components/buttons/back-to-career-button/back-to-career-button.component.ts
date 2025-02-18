import { Meta, Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-back-to-career-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './back-to-career-button.component.html',
  styleUrl: './back-to-career-button.component.scss'
})
export class BackToCareerButtonComponent {
  currentLanguage: string = 'en';

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private router: Router,
    private translationHelper: TranslationHelper
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }


  goBack(): void {
    this.router.navigate(['/about']);
  }
}
