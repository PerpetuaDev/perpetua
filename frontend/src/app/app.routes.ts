import { Routes } from '@angular/router';
// Components
import { AboutComponent } from './pages/about/about.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleDetailComponent } from './pages/articles/article-detail/article-detail.component';
import { ArticleSearchResultComponent } from './pages/articles/article-search-result/article-search-result.component';
import { CareersComponent } from './pages/careers/careers.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientsListComponent } from './pages/clients/clients-list/clients-list.component';
import { ClientsTestimonialComponent } from './pages/clients/clients-testimonial/clients-testimonial.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HistoryComponent } from './pages/about/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OfficeDetailComponent } from './pages/about/office-detail/office-detail.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ProjectIndustryComponent } from './pages/projects/project-industry/project-industry.component';
import { ProjectSearchResultComponent } from './pages/projects/project-search-result/project-search-result.component';
import { ProjectTagComponent } from './pages/projects/project-tag/project-tag.component';
import { SearchComponent } from './pages/search/search.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/services/service-detail/service-detail.component';
import { TeamComponent } from './pages/team/team.component';
import { TermsComponent } from './pages/terms/terms.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'projects', component: ProjectsComponent },
    // { path: 'projects/results', component: ProjectSearchResultComponent },
    { path: 'projects/industries/:industry', component: ProjectIndustryComponent },
    { path: 'projects/:id', component: ProjectDetailComponent },
    { path: 'projects/tags', component: ProjectTagComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'services/details/:serviceTitle', component: ServiceDetailComponent },
    { path: 'about', component: AboutComponent },
    { path: 'about/:id', component: OfficeDetailComponent },
    { path: 'about/history', component: HistoryComponent },
    { path: 'articles', component: ArticlesComponent },
    // { path: 'articles/results', component: ArticleSearchResultComponent },
    { path: 'articles/:id', component: ArticleDetailComponent },
    { path: 'careers/:id', component: CareersComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'clients/all', component: ClientsListComponent },
    // { path: 'clients/testimonials', component: ClientsTestimonialComponent },
    { path: 'search', component: SearchComponent },
    { path: 'team', component: TeamComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'terms', component: TermsComponent },
    { path: '**', component: NotFoundComponent }
];