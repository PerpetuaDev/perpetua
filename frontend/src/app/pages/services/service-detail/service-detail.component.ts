// Libraries
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
// Components
import { MoreProjectButtonComponent } from '../../../components/buttons/more-project-button/more-project-button.component';
import { StartProjectButtonComponent } from '../../../components/buttons/start-project-button/start-project-button.component';
import { ServiceHeaderSkeletonComponent } from '../../../components/skeletons/service-header-skeleton/service-header-skeleton.component';
import { ProjectCardComponent } from '../../../components/project-cards/project-card/project-card.component';
// Services
import { TranslationHelper } from '../../../shared/translation-helper';
import { ServiceService } from '../../../shared/service.service';
import { ProjectService } from '../../../shared/project.service';
import { StaticImageService } from '../../../shared/static-image.service';
import { IProject, IService } from '../../../../util/interfaces';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MoreProjectButtonComponent,
    StartProjectButtonComponent,
    ServiceHeaderSkeletonComponent,
    ProjectCardComponent
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})

export class ServiceDetailComponent implements OnInit, OnDestroy {
  currentService: (IService & { image?: string }) | undefined;
  currentTitle: string = '';
  isLoading$!: Observable<boolean | null>;
  projectsByServiceType$: Observable<IProject[]>;
  currentLanguage: string = 'en';
  private sub = new Subscription();

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private translationHelper: TranslationHelper,
    private translate: TranslateService,
    private staticImageService: StaticImageService,
    private projectService: ProjectService,
    private serviceService: ServiceService,
  ) {
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
    this.isLoading$ = this.staticImageService.isLoading$;
    this.projectsByServiceType$ = this.projectService.getProjectsByServiceType('');
  }

  ngOnInit() {
    this.sub.add(
      combineLatest([
        this.activatedRoute.paramMap,
        this.serviceService.services$
      ]).subscribe(([params, services]) => {
        const slug = params.get('serviceTitle');
        const service = services.find(s => s.slug === slug);
        if (service) {
          this.currentService = { ...service, image: this.currentService?.image };
          this.currentTitle = service.title;
          this.projectsByServiceType$ = this.projectService.getProjectsByServiceType(this.currentTitle);
          this.titleService.setTitle(`Our service (${service.title}) - Perpetua`);
          this.metaService.updateTag({ name: 'description', content: service.explanation });
          this.showScreenTop();
        }
      })
    );

    this.sub.add(
      this.staticImageService.staticImages$.subscribe((staticImages) => {
        if (staticImages.length > 0 && this.currentService) {
          const locationKey = `service-${this.currentService.slug}-header-image`;
          const matched = staticImages.find(img => img.image_location === locationKey);
          if (matched) {
            this.currentService = { ...this.currentService, image: matched.image.url };
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
    this.sub.unsubscribe();
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

  getArticleForTitle(title?: string): string {
    if (!title) return '';
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(title[0].toLowerCase()) ? 'an' : 'a';
  }

  showScreenTop(): void {
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
  }
}
