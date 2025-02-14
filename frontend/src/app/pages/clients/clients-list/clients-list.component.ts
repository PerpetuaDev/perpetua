// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { CallActionComponent } from '../../../components/call-action/call-action.component';
import { FooterComponent } from '../../../components/footer/footer.component';
// Services
import { ClientService } from '../../../shared/client.service';
import { TranslationHelper } from '../../../shared/translation-helper';
import { IClient } from '../../../../util/interfaces';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, CallActionComponent, FooterComponent],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})

export class ClientsListComponent implements OnInit, OnDestroy {
  clients$: Observable<IClient[]>;
  selectedClientIndex: number = 0;
  currentLanguage: string = 'en';

  constructor(private titleService: Title, private metaService: Meta, private clientService: ClientService, private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.clients$ = this.clientService.getClients();
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Our Client List - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Discover the full list of our clients and learn more about the impactful collaborations we’ve fostered at Perpetua.' });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}
