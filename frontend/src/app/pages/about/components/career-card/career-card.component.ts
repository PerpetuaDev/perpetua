// Libraries
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { LanguageService } from '../../../../shared/language.service';
import { ICareer } from '../../../../../util/interfaces';

@Component({
  selector: 'app-career-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './career-card.component.html',
  styleUrl: './career-card.component.scss'
})

export class CareerCardComponent implements OnInit, OnDestroy {
  @Input() careers?: ICareer[] = [];
  @Input() career?: ICareer | null = null;
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
