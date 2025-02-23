// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
// Components
import { CallActionComponent } from '../../../components/call-action/call-action.component';
import { MoreProjectButtonComponent } from '../../../components/buttons/more-project-button/more-project-button.component';
import { StartProjectButtonComponent } from '../../../components/buttons/start-project-button/start-project-button.component';
import { ServiceHeaderSkeletonComponent } from '../../../components/skeletons/service-header-skeleton/service-header-skeleton.component';
import { ProjectCardComponent } from '../../../components/project-card/project-card.component';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';
import { ServiceDetailData } from './service-detail-data';
import { ProjectService } from '../../../shared/project.service';
import { StaticImageService } from '../../../shared/static-image.service';
import { IProject } from '../../../../util/interfaces';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CallActionComponent,
    MoreProjectButtonComponent,
    StartProjectButtonComponent,
    ServiceHeaderSkeletonComponent,
    ProjectCardComponent
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})

export class ServiceDetailComponent implements OnInit, OnDestroy {
  currentService: any;
  currentTitle: string = '';
  ServiceDetailData = [...ServiceDetailData];
  isLoading$!: Observable<boolean | null>;
  projectsByServiceType$: Observable<IProject[]>;
  currentLanguage: string = 'en';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private translationHelper: TranslationHelper,
    private translate: TranslateService,
    private staticImageService: StaticImageService,
    private projectService: ProjectService,
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.isLoading$ = this.staticImageService.isLoading$;
    this.projectsByServiceType$ = this.projectService.getProjectsByServiceType(this.currentTitle);
  }

  ngOnInit() {
    const serviceTitle = this.activatedRoute.snapshot.paramMap.get('serviceTitle');
    this.currentService = this.ServiceDetailData.find(service => service.code === serviceTitle);

    if (serviceTitle === this.currentService.code) {
      this.currentTitle = this.currentService.title;
      this.projectsByServiceType$ = this.projectService.getProjectsByServiceType(this.currentTitle);
      this.projectsByServiceType$.subscribe(projects => {
      });

      this.fetchProjects();

      // Meta info for SEO
      if (this.currentService) {
        this.titleService.setTitle(`Our service (${this.currentService.title}) - Perpetua`);
        this.metaService.updateTag({ name: 'description', content: this.currentService.explanation });
      }
    }

    this.staticImageService.staticImages$.subscribe((staticImages) => {
      if (staticImages.length > 0) {
        this.ServiceDetailData = this.ServiceDetailData.map((service) => {
          if (this.currentService?.title === service.title) {
            this.currentTitle = this.currentService?.title;
          }

          const matchedImage = staticImages.find(image =>
            this.getServiceIndexFromLocation(image.image_location) === this.ServiceDetailData.indexOf(service)
          );
          if (matchedImage) {
            service.image = matchedImage.image.url;
            if (this.currentService?.code === service.code) {
              this.currentService.image = matchedImage.image.url;
            }
          }
          return service;
        });
      }
    });

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  getFormattedTitle(title: string): string {
    switch (title) {
      case 'Custom Software': return 'custom software';
      case 'Websites & CMS': return 'websites & CMS';
      case 'Native & Web Apps': return 'native & web apps';
      case 'Artificial Intelligence': return 'artificial intelligence';
      case 'Hosting & Cloud Services': return 'hosting & cloud services';
      case 'Data & Analytics': return 'data & analytics';
      default: return title.toLowerCase();
    }
  }

  getServiceIndexFromLocation(imageLocation: any): number {
    const mappings: { [key: string]: number } = {
      'service-custom-software-header-image': 0,
      'service-websites&cms-header-image': 1,
      'service-native&web-apps-header-image': 2,
      'service-artificial-intelligence-header-image': 3,
      'service-hosting&cloud-services-header-image': 4,
      'service-data&analytics-header-image': 5,
    };
    return mappings[imageLocation] ?? -1;
  }

  fetchProjects() {
    console.log("🔍 Fetching projects for service type:", this.currentTitle);
    this.projectsByServiceType$ = this.projectService.getProjectsByServiceType(this.currentTitle);
  }
}
