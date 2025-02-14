// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
// Components
import { ProjectCardComponent } from '../../../components/project-card/project-card.component';
import { CareerCardComponent } from '../components/career-card/career-card.component';
import { ArticleAndProjectCardSkeletonComponent } from '../../../components/skeletons/article-and-project-card-skeleton/article-and-project-card-skeleton.component';
// Services
import { StrapiService } from '../../../api/strapi.service';
import { IOffice, ICareer, APIResponseModel } from '../../../../util/interfaces';
import { TranslationHelper } from '../../../shared/translation-helper';
import { environment } from '../../../../environments/environment.development';
import { ProjectService } from '../../../shared/project.service';
import { CareerService } from '../../../shared/career.service';
import { OfficeService } from '../../../shared/office.service';
import { IProject } from '../../../../util/interfaces';

@Component({
  selector: 'app-office-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ProjectCardComponent,
    CareerCardComponent,
    ArticleAndProjectCardSkeletonComponent
  ],
  templateUrl: './office-detail.component.html',
  styleUrl: './office-detail.component.scss'
})
export class OfficeDetailComponent implements OnInit, OnDestroy {
  career: ICareer | null = null;
  careers: ICareer[] = [];
  offices$: Observable<IOffice[]>;
  projects$: Observable<IProject[]>;
  isLoading$!: Observable<boolean | null>;
  documentId!: string;
  office?: IOffice;
  memberNames: string[] = [];
  formattedTime: { hours: string, minutes: string, period: string } | null = null;
  strapiUrl = environment.strapiMediaUrl;
  projectService: ProjectService = inject(ProjectService);
  private intervalId: any;
  private timeoutId: any;
  currentLanguage: string = 'en';

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private location: Location,
    private strapiService: StrapiService,
    private activatedRoute: ActivatedRoute,
    private translationHelper: TranslationHelper,
    private careerService: CareerService,
    private officeService: OfficeService
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.projects$ = this.projectService.projects$;
    this.isLoading$ = this.projectService.isLoading$;
    this.offices$ = this.officeService.offices$;
    this.career = this.careerService.getCareerData();
    this.careers = this.careerService.getAllCareers();
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });

    this.careerService.careers$.subscribe(careers => {
      this.careers = careers;
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.documentId = id;
        localStorage.setItem('documentId', this.documentId);
      } else {
        this.documentId = localStorage.getItem('documentId') || '';
      }

      if (this.documentId) {
        this.offices$.subscribe(offices => {
          this.office = offices.find(office => office.documentId === this.documentId);

          if (this.office) {
            this.titleService.setTitle(`${this.office.office_location} - Perpetua`);
            this.metaService.updateTag({
              name: 'description',
              content: `Learn more about our office in ${this.office.office_location}.`
            });
          } else {
            console.error('Office not found for the given document ID');
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    localStorage.removeItem('documentId');
  }

  formatCurrentTime(currentTime: string): void {
    const [hoursMinutes, period] = currentTime.split(' ');
    const [hours, minutes] = hoursMinutes.split(':');
    this.formattedTime = { hours, minutes, period: period.toLowerCase() };
  }

  openGoogleMaps(): void {
    let address = `${this.office?.address_1}, ${this.office?.address_2 ? this.office?.address_2 + ', ' : ''}${this.office?.city}, ${this.office?.country}`;
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    window.open(googleMapsUrl, '_blank');
  }

  sendEmail(): void {
    if (this.office?.email) {
      const mailtoLink = `mailto:${this.office.email}`;
      window.location.href = mailtoLink;
    }
  }

  sendEmailKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'Enter' || event.key === ' ') && this.office?.email) {
      event.preventDefault();
      this.sendEmail();
    }
  }
}