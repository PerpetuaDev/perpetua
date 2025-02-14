// Libraries
import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// Components
import { ServiceCardComponent } from './components/service-card/service-card.component';
// Services
import { TranslationHelper } from '../../../../shared/translation-helper';
import { LanguageService } from '../../../../shared/language.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, RouterLink, TranslateModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent implements OnDestroy {
  currentLanguage: string = 'en';
  private langChangeSubscription!: Subscription;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();

    this.langChangeSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
