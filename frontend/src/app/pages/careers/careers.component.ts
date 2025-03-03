// libraries
import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Observable } from 'rxjs';
// Components
import { BackToCareerButtonComponent } from '../../components/buttons/back-to-career-button/back-to-career-button.component';
import { ApplyJobFormComponent } from './components/apply-job-form/apply-job-form.component';
import { CareerHeaderSkeletonComponent } from '../../components/skeletons/career-header-skeleton/career-header-skeleton.component';
// Services
import { ICareer, APIResponseModel } from '../../../util/interfaces';
import { StrapiService } from '../../api/strapi.service';
import { IStaticImage } from '../../../util/interfaces';
import { StaticImageService } from '../../shared/static-image.service';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [
    CommonModule,
    ApplyJobFormComponent,
    BackToCareerButtonComponent,
    CareerHeaderSkeletonComponent
  ],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})

export class CareersComponent implements OnInit {
  staticImages$: Observable<IStaticImage[]>
  isLoading$!: Observable<boolean | null>;
  documentId: string = '';
  headerImage: string = '';
  career: ICareer | null = null;
  jobDescriptionHtml: SafeHtml = '';
  activeOfferIndex: number | null = null;
  offers = [
    {
      title: 'Supportive & Friendly Work Environment',
      description:
        "At Perpetua we believe people produce their best work when they’re happy, rested, and they feel their work has meaning. It’s with this in mind that we take particular care to foster a supportive and friendly workplace—no one at Perpetua has ever been punished for making a mistake, as making mistakes is a natural part of pushing for the top.",
      visible: false
    },
    {
      title: 'Health & Wellness Programs & Subsidies',
      description:
        'As part of our investment in a happy, healthy, productive workplace, we offer every member of staff support for maintaining and bettering your physical and mental health. This includes subsidised or completely covered fitness memberships, and an employee assistance program with our client OCP.',
      visible: false
    },
    {
      title: 'Flexible Hours, Location & Remote Work',
      description:
        "As part of Perpetua’s global team, you’ll have access to a shared office space as per your location. However, there’s no requirement to go in. Many of our team prefer the security of fixed hours, (and some positions demand relatively fixed hours) but many others can choose the days, times and locations of their work as it suits their schedules, and we encourage them to do so.",
      visible: false
    },
    {
      title: 'Flexible Hours, Location & Remote Work',
      description:
        "As part of Perpetua’s global team, you’ll have access to a shared office space as per your location. However, there’s no requirement to go in. Many of our team prefer the security of fixed hours, (and some positions demand relatively fixed hours) but many others can choose the days, times and locations of their work as it suits their schedules, and we encourage them to do so.",
      visible: false
    },
    {
      title: 'Flexible Hours, Location & Remote Work',
      description:
        "As part of Perpetua’s global team, you’ll have access to a shared office space as per your location. However, there’s no requirement to go in. Many of our team prefer the security of fixed hours, (and some positions demand relatively fixed hours) but many others can choose the days, times and locations of their work as it suits their schedules, and we encourage them to do so.",
      visible: false
    },
    {
      title: 'Flexible Hours, Location & Remote Work',
      description:
        "As part of Perpetua’s global team, you’ll have access to a shared office space as per your location. However, there’s no requirement to go in. Many of our team prefer the security of fixed hours, (and some positions demand relatively fixed hours) but many others can choose the days, times and locations of their work as it suits their schedules, and we encourage them to do so.",
      visible: false
    }
  ];
  strapiService = inject(StrapiService);
  route = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private staticImageService: StaticImageService,
  ) {
    this.isLoading$ = this.staticImageService.isLoading$;
    this.staticImages$ = this.staticImageService.staticImages$;
  }

  async ngOnInit(): Promise<void> {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });

    this.route.paramMap.subscribe((params) => {
      this.documentId = params.get('id') || '';

      if (this.documentId) {
        this.strapiService.getCareerById(this.documentId).subscribe(
          async (result: APIResponseModel) => {
            if (result && result.data) {
              this.career = result.data;
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

        this.staticImages$.subscribe((staticImages) => {
          if (staticImages && staticImages.length > 0) {
            staticImages.map((image: IStaticImage) => {
              if (image.image_location === 'career-header-image') {
                this.headerImage = image.image.url;
              }
            });
          }
        });
      }
    });
  }

  private async parseMarkdown(markdown: string): Promise<string> {
    const result = marked.parse(markdown);
    if (result instanceof Promise) {
      return await result;
    }
    return result;
  }

  toggleDetail(index: number): void {
    if (this.activeOfferIndex === index) {
      this.offers[index].visible = !this.offers[index].visible;
    } else {
      if (this.activeOfferIndex !== null) {
        this.offers[this.activeOfferIndex].visible = false;
      }
      this.offers[index].visible = true;
    }

    this.activeOfferIndex = this.offers[index].visible ? index : null;
  }
}