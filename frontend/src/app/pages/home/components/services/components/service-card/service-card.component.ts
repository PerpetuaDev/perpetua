// Libraries
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
// Interfaces
import { IService } from '../../../../../../../util/interfaces';
// Services
import { ServiceService } from '../../../../../../shared/service.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})

export class ServiceCardComponent {
  services$: Observable<IService[]>;
  isVisible: Record<number, boolean> = {};

  constructor(private serviceService: ServiceService) {
    this.services$ = this.serviceService.services$;
  }

  showDescription(index: number): void {
    this.isVisible[index] = !this.isVisible[index];
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.showDescription(index);
    }
  }
}
