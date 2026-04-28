// Libraries
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Services
import { ServiceData } from '../../../home/components/services/service-data';
import { IService } from '../../../../../util/interfaces';
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() isServiceDetail: boolean = false;
  services: IService[] = ServiceData;

  constructor(
    private translationHelper: TranslationHelper,
    private translate: TranslateService,
  ) {}

  getTitle(service: IService): string {
    return this.translate.instant(service.title);
  }

  getDescription(service: IService): string {
    return this.translate.instant(service.card_description);
  }

  getPath(service: IService): string {
    return service.slug || 'no-title';
  }
}
