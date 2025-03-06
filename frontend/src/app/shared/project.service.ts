// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { StrapiService } from '../api/strapi.service';
import { IProject, APIResponseModel } from '../../util/interfaces';

@Injectable({
    providedIn: 'root'
})

export class ProjectService {
    private projectsSubject = new BehaviorSubject<IProject[]>([]);
    projects$ = this.projectsSubject.asObservable();

    public filteredProjectsSubject = new BehaviorSubject<IProject[]>([]);
    filteredProjects$ = this.filteredProjectsSubject.asObservable();

    private selectedFilterSubject = new BehaviorSubject<string | null>('all');
    selectedFilter$ = this.selectedFilterSubject.asObservable();

    private projectsByIndustrySubject = new BehaviorSubject<{ [industry: string]: IProject[] }>({});
    projectsByIndustry$ = this.projectsByIndustrySubject.asObservable();

    public projectsByServiceTypeSubject = new BehaviorSubject<IProject[]>([]);
    projectsByServiceType$ = this.projectsByServiceTypeSubject.asObservable();

    public moreProjectsSubject = new BehaviorSubject<IProject[]>([]);
    moreProjects$ = this.moreProjectsSubject.asObservable();


    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    private searchResultsSubject = new BehaviorSubject<IProject[]>([]);
    searchResults$ = this.searchResultsSubject.asObservable();

    constructor(private strapiService: StrapiService) {
        this.fetchProjects();
    }

    private fetchProjects(): void {
        this.loadingSubject.next(true);
        this.strapiService.getAllProjects().subscribe((result: APIResponseModel) => {
            const projects = result.data.map((project: IProject) => ({
                ...project,
                thumbnail_image: project.thumbnail_image
                    ? {
                        ...project.thumbnail_image,
                        url: project.thumbnail_image.url
                    } : { url: "../../../../../assets/images/img_n.a.png" }
            }));
            this.projectsSubject.next(projects);
            this.filteredProjectsSubject.next(projects);
            this.groupProjectsByIndustry(projects);
            this.loadingSubject.next(false);
        }, error => {
            console.error('Error fetching projects:', error);
            this.loadingSubject.next(false);
        });
    }

    filterProjects(type: string): void {
        const currentProjects = this.projectsSubject.getValue();

        if (this.selectedFilterSubject.getValue() === type || type === 'all') {
            this.selectedFilterSubject.next('all');
            this.filteredProjectsSubject.next(currentProjects);
        } else {
            const filteredProjects = currentProjects.filter(project => project.project_type === type);
            this.selectedFilterSubject.next(type);
            this.filteredProjectsSubject.next(filteredProjects);
        }
    }

    private groupProjectsByIndustry(projects: IProject[]): void {
        const projectsByIndustry: { [industry: string]: IProject[] } = {};

        projects.forEach((project) => {
            if (project.industry) {
                const industryKey = project.industry.toLowerCase();
                if (!projectsByIndustry[industryKey]) {
                    projectsByIndustry[industryKey] = [];
                }
                projectsByIndustry[industryKey].push(project);
            }
        });

        this.projectsByIndustrySubject.next(projectsByIndustry);
    }

    public selectMoreProjectByDate(currentProjectDocumentId: string): void {
        this.strapiService.getAllProjects().subscribe((result: APIResponseModel) => {
            if (result && result.data) {
                const allProjects: IProject[] = result.data.map((project: IProject) => ({
                    ...project,
                    thumbnail_image: project.thumbnail_image
                        ? {
                            ...project.thumbnail_image,
                            url: project.thumbnail_image.url || "../../../../../assets/images/img_n.a.png"
                        } : { url: "../../../../../assets/images/img_n.a.png" }
                }));

                const filteredProjects = allProjects.filter(project => project.documentId !== currentProjectDocumentId);
                const sortedProjects = filteredProjects.sort((a, b) => {
                    const dateA = new Date(a.project_date).getTime();
                    const dateB = new Date(b.project_date).getTime();
                    return dateB - dateA; // Sort by descending order (latest projects first)
                });

                const moreProjects = sortedProjects.slice(0, 3);
                this.moreProjectsSubject.next(moreProjects);
            }
        }, error => {
            console.error('Error fetching projects:', error);
        });
    }

    setSearchResults(results: IProject[]): void {
        const dataWithTimestamp = {
            results,
            timestamp: Date.now(),
        };
        localStorage.setItem('projectSearchResults', JSON.stringify(dataWithTimestamp));
        this.searchResultsSubject.next(results);
    }

    getSearchResults(): IProject[] {
        const savedResults = localStorage.getItem('projectSearchResults');
        if (savedResults) {
            const { results, timestamp } = JSON.parse(savedResults);
            const expiryTime = 60 * 60 * 1000; // 1 hour
            if (Date.now() - timestamp > expiryTime) {
                this.clearSearchResults();
                return [];
            }
            return results;
        }
        return [];
    }

    clearSearchResults(): void {
        this.searchResultsSubject.next([]);
        localStorage.removeItem('projectSearchResults');
    }

    public getProjectsByServiceType(serviceType: string): Observable<IProject[]> {
        return this.projects$.pipe(
            map((projects) => {
                const filteredProjects = projects.filter(
                    (project) => project.service_type?.toLowerCase() === serviceType.toLowerCase()
                );
                return filteredProjects;
            })
        );
    }

}
