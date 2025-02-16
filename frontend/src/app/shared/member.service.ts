// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// Services
import { IMember, APIResponseModel, IImage } from '../../util/interfaces';
import { StrapiService } from '../api/strapi.service';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})

export class MemberService {
    private membersSubject = new BehaviorSubject<IMember[]>([]);
    members$ = this.membersSubject.asObservable();

    private filteredMembersSubject = new BehaviorSubject<IMember[]>([]);
    filteredArticles$ = this.filteredMembersSubject.asObservable();

    private selectedFilterSubject = new BehaviorSubject<string | null>('all');
    selectedFilter$ = this.selectedFilterSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    strapiUrl = environment.strapiMediaUrl;

    constructor(private strapiService: StrapiService) {
        this.fetchMembers();
    }

    fetchMembers(): void {
        this.loadingSubject.next(true);
        this.strapiService.getAllMembers().subscribe((result: APIResponseModel) => {
            const members = result.data
                .map((member: IMember) => {
                    // Log each member's portrait image URL (before and after mapping)
                    console.log('Portrait image before mapping:', member.portrait_image);

                    return {
                        ...member,
                        portrait_image: member.portrait_image
                            ? {
                                ...member.portrait_image,
                                url: member.portrait_image?.url
                            }
                            : { url: "../../../../../assets/images/img_n.a.png" }
                    };
                })
                .sort((a: any, b: any) => a.last_name.localeCompare(b.last_name));
            this.membersSubject.next(members);
            this.filteredMembersSubject.next(members);
            this.loadingSubject.next(false);
        }, error => {
            console.error('Error fetching members:', error);
            this.loadingSubject.next(false);
        });
    }


    sortMembers(type: string): void {
        const members = this.membersSubject.getValue();

        if (type === 'all' || this.selectedFilterSubject.getValue() === type) {
            this.selectedFilterSubject.next('all');
            const sortedMembers = [...members].sort((a, b) => a.last_name.localeCompare(b.last_name));
            this.filteredMembersSubject.next(sortedMembers);
        } else if (type === 'office') {
            this.selectedFilterSubject.next(type);

            const locationOrder = ['Christchurch', 'Auckland', 'Sydney', 'Yokohama'];
            const filteredMembers = members
                .filter(member => locationOrder.includes(member.location))
                .sort((a, b) => {
                    const locationComparison = locationOrder.indexOf(a.location) - locationOrder.indexOf(b.location);
                    if (locationComparison !== 0) {
                        return locationComparison;
                    }
                    return a.last_name.localeCompare(b.last_name);
                });

            this.filteredMembersSubject.next(filteredMembers);
        } else if (type === 'role') {
            this.selectedFilterSubject.next(type);

            const roleCategories = [
                { name: 'Administration & Management', keywords: ['CEO', 'executive', 'assistant'] },
                { name: 'Design', keywords: ['designer'] },
                { name: 'Software Engineering', keywords: ['software', 'developer'] },
                { name: 'Accountant', keywords: ['accountant'] },
                { name: 'Data Analytics', keywords: ['data'] },
            ];

            let filteredMembers: IMember[] = [];

            roleCategories.forEach(category => {
                const membersInCategory = members
                    .filter(member => category.keywords.some(keyword => member.role.toLowerCase().includes(keyword.toLowerCase())))
                    .sort((a, b) => a.last_name.localeCompare(b.last_name));

                filteredMembers = [...filteredMembers, ...membersInCategory];
            });

            const sortedMembers = filteredMembers.sort((a, b) => a.last_name.localeCompare(b.last_name));
            this.filteredMembersSubject.next(sortedMembers);
        }
    }

    getFilteredMembers(): IMember[] {
        return this.filteredMembersSubject.getValue();
    }
}