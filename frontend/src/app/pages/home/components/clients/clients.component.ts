// Libraries
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { ClientCardComponent } from './components/client-card/client-card.component';
// Services
import { IClient, APIResponseModel, IImage } from '../../../../../util/interfaces';
import { StrapiService } from '../../../../api/strapi.service';
import { TranslationHelper } from '../../../../shared/translation-helper';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientCardComponent, RouterLink, CommonModule, TranslateModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: IClient[] = [];
  selectedClientIndex: number = 0;
  strapiService = inject(StrapiService);
  currentLanguage: string = 'en';
  parsedTestimonial: SafeHtml | undefined;

  constructor(private sanitizer: DomSanitizer, private translationHelper: TranslationHelper) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.strapiService.getAllClients().subscribe((result: APIResponseModel) => {
      this.clients = result.data;
      this.clients = this.clients
        .map(client => ({
          ...client,
          company_logo: this.formatCompanyLogo(client.company_logo)
        }))
        .sort((a, b) => a.company_name.localeCompare(b.company_name))
        .slice(0, 9);

      this.parseTestimonial(this.clients[this.selectedClientIndex].testimonial);
    }, error => {
      console.error('Error fetching clients:', error);
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  formatCompanyLogo(logo: IImage | null): IImage {
    if (!logo || !logo.url) {
      return {
        id: 0,
        documentId: '',
        name: 'default',
        url: "../../../assets/images/img_n.a.png",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return {
      ...logo,
      url: logo.url || "../../../assets/images/img_n.a.png"
    };
  }

  async parseTestimonial(testimonial: any): Promise<void> {
    if (testimonial) {
      try {
        let styledContent = await marked.parse(testimonial);

        const words = styledContent.split(/\s+/);

        for (let i = words.length - 1; i >= 0; i--) {
          if (words[i].includes('</p>')) {
            words[i] = words[i].replace('</p>', '&rdquo;</p>');
            break;
          }
        }

        styledContent = words.join(' ');

        this.parsedTestimonial = this.sanitizer.bypassSecurityTrustHtml(styledContent);
      } catch (error) {
        console.error('Error parsing testimonial:', error);
      }
    }
  }

  async onClientSelected(index: number): Promise<void> {
    this.selectedClientIndex = index;
    await this.parseTestimonial(this.clients[this.selectedClientIndex].testimonial);
  }
}