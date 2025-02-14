// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// Components
import { CallActionComponent } from '../../components/call-action/call-action.component';
import { BackToTopButtonComponent } from '../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ServiceProcessComponent } from './components/service-process/service-process.component';
import { StartProjectButtonComponent } from '../../components/buttons/start-project-button/start-project-button.component';
// Services
import { LanguageService } from '../../shared/language.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CallActionComponent,
    BackToTopButtonComponent,
    ServiceCardComponent,
    ServiceProcessComponent,
    StartProjectButtonComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  private langChangeSubscription!: Subscription;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    // Meta info for SEO
    this.titleService.setTitle('What we do - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse Services to learn more about our ultimate services at Perpetua.' });

    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.langChangeSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        this.currentLanguage = lang;
      }
    );

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
