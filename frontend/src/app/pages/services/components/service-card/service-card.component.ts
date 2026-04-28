import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IService } from '../../../../../util/interfaces';
import { ServiceService } from '../../../../shared/service.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() isServiceDetail: boolean = false;
  services$: Observable<IService[]>;

  constructor(private serviceService: ServiceService) {
    this.services$ = this.serviceService.services$;
  }
}
