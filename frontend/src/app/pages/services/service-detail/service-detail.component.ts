// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
// Components
import { CallActionComponent } from '../../../components/call-action/call-action.component';
import { BackToTopButtonComponent } from '../../../components/buttons/back-to-top-button/back-to-top-button.component';
import { ServiceCardComponent } from '../components/service-card/service-card.component';
import { ServiceDetailData } from './service-detail-data';
import { StartProjectButtonComponent } from '../../../components/buttons/start-project-button/start-project-button.component';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, CallActionComponent, BackToTopButtonComponent, ServiceCardComponent, StartProjectButtonComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})

export class ServiceDetailComponent implements OnInit, OnDestroy {
  currentService: any;
  ServiceDetailData = ServiceDetailData;
  currentLanguage: string = 'en';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private translationHelper: TranslationHelper,
    private translate: TranslateService
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit() {
    const serviceTitle = this.activatedRoute.snapshot.paramMap.get('serviceTitle');
    console.log(serviceTitle)
    if (serviceTitle) {
      this.currentService = this.ServiceDetailData.find(service => service.code === serviceTitle);

      // Meta info for SEO
      if (this.currentService) {
        this.titleService.setTitle(`Our service (${this.currentService.title}) - Perpetua`);
        this.metaService.updateTag({ name: 'description', content: this.currentService.explanation });
      }
    }
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  getFormattedTitle(title: string): string {
    switch (title) {
      case 'Custom Software':
        return 'custom software';
      case 'Websites & CMS':
        return 'websites & CMS';
      case 'Native & Web Apps':
        return 'native & web apps';
      case 'Artificial Intelligence':
        return 'artificial intelligence';
      case 'Hosting & Cloud Services':
        return 'hosting & cloud services';
      case 'Data & Analytics':
        return 'data & analytics';
      default:
        return title.toLowerCase();
    }
  }
}
