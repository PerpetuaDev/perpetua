// libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
// Components
import { FooterComponent } from '../../components/footer/footer.component';
// Services
import { ICareer, APIResponseModel } from '../../../util/interfaces';
import { StrapiService } from '../../api/strapi.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})

export class CareersComponent implements OnInit {
  documentId: string = '';
  career: ICareer | null = null;
  jobDescriptionHtml: SafeHtml = '';
  activeOfferIndex: number | null = null;
  offers = [
    {
      title: 'Supportive & Friendly Work Environment',
      description:
        "At Perpetua we believe people produce their best work when they’re happy, rested, and they feel their work has meaning. It’s with this in mind that we take particular care to foster a supportive and friendly workplace—no one at Perpetua has ever been punished for making a mistake, as making mistakes is a natural part of pushing for the top."
    },
    {
      title: 'Health & Wellness Programs & Subsidies',
      description:
        'As part of our investment in a happy, healthy, productive workplace, we offer every member of staff support for maintaining and bettering your physical and mental health. This includes subsidised or completely covered fitness memberships, and an employee assistance program with our client OCP.'
    },
    {
      title: 'Flexible Hours, Location & Remote Work',
      description:
        "As part of Perpetua’s global team, you’ll have access to a shared office space as per your location. However, there’s no requirement to go in. Many of our team prefer the security of fixed hours, (and some positions demand relatively fixed hours) but many others can choose the days, times and locations of their work as it suits their schedules, and we encourage them to do so."
    }
  ];
  strapiService = inject(StrapiService);
  route = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);
  strapiUrl = environment.strapiMediaUrl;

  constructor(private titleService: Title, private metaService: Meta) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params) => {
      this.documentId = params.get('id') || '';

      if (this.documentId) {
        this.strapiService.getCareerById(this.documentId).subscribe(
          async (result: APIResponseModel) => {
            if (result && result.data) {
              this.career = result.data;

              console.log(this.career)

              if (this.career?.job_description) {
                const rawHtml = await this.parseMarkdown(this.career.job_description);
                this.jobDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
              }

              if (this.career?.job_title) {
                this.titleService.setTitle(`Careers | ${this.career.job_title} - Perpetua`);
                this.metaService.updateTag({
                  name: 'description',
                  content: `Explore the opportunity for a ${this.career.job_title} position at Perpetua. Join our team and grow your career!`
                });
              }
            }
          },
          (error) => {
            console.error('Error fetching career:', error);
          }
        );

        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
    });
  }

  private async parseMarkdown(markdown: string): Promise<string> {
    const result = marked.parse(markdown);
    if (result instanceof Promise) {
      return await result;
    }
    console.log(result)
    return result;
  }

  toggleDetail(index: number): void {
    this.activeOfferIndex = this.activeOfferIndex === index ? null : index;
  }
}