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
import { APIResponseModel, IClient } from '../../../util/interfaces';
// Components
import { ClientBlockAboutComponent } from '../../components/client-cards/client-block-about/client-block-about.component';
import { StrapiService } from '../../api/strapi.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, ClientBlockAboutComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})

export class ClientsComponent implements OnInit, OnDestroy {
  clients$: Observable<IClient[]>;
  clients: IClient[] = [];
  selectedClientIndex: number = 0;
  currentLanguage: string = 'en';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private clientService: ClientService,
    private translationHelper: TranslationHelper,
    private strapiService: StrapiService
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.clients$ = this.clientService.getClients();
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Our Clients - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Explore our esteemed clients who have partnered with us to achieve outstanding results in their industries.' });

    this.strapiService.getAllClients().subscribe((response: APIResponseModel) => {
      this.clients = response.data.map((client: IClient) => ({
        ...client,
        company_logo: client.company_logo ? {
          ...client.company_logo,
          url: client.company_logo.url || "../../../assets/images/img_n.a.png"
        } : { url: "../../../assets/images/img_n.a.png" }
      }));
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }
}