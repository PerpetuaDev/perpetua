// Libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { ClientService } from '../../shared/client.service';
import { TranslationHelper } from '../../shared/translation-helper';
import { IClient } from '../../../util/interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})

export class ClientsComponent implements OnInit, OnDestroy {
  clients$: Observable<IClient[]>;
  selectedClientIndex: number = 0;
  currentLanguage: string = 'en';

  constructor(private titleService: Title, private metaService: Meta, private clientService: ClientService, private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.clients$ = this.clientService.getClients();
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Our Clients - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Explore our esteemed clients who have partnered with us to achieve outstanding results in their industries.' });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}