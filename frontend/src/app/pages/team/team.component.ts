import { Meta, Title } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// Components
import { StaffCardComponent } from '../about/components/member-card/member-card.component';
import { BackToTopButtonComponent } from '../../components/buttons/back-to-top-button/back-to-top-button.component';
// Service
import { IMember } from '../../../util/interfaces';
import { TranslationHelper } from '../../shared/translation-helper';
import { MemberService } from '../../shared/member.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    StaffCardComponent,
    BackToTopButtonComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})

export class TeamComponent implements OnInit, OnDestroy {
  members$: Observable<IMember[]>;
  selectedFilter$: Observable<string | null>;
  memberService = inject(MemberService);
  currentLanguage: string = 'en';

  membersByCategory: { category: SafeHtml; members: IMember[] }[] = [];

  // Lazy loading
  visibleMembers: IMember[] = [];
  private allMembers: IMember[] = [];
  membersToLoad: number = 12;
  loadMoreButtonVisible: boolean = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translationHelper: TranslationHelper,
    private sanitizer: DomSanitizer
  ) {
    this.members$ = this.memberService.members$;
    this.selectedFilter$ = this.memberService.selectedFilter$;
    this.currentLanguage = this.translationHelper.getCurrentLanguage();
  }

  ngOnInit(): void {
    // Meta info for SEO
    this.titleService.setTitle('Our team - Perpetua');
    this.metaService.updateTag({ name: 'description', content: 'Browse our staff at Perpetua by a location or role.' });

    this.selectedFilter$.subscribe((filter) => {
      if (filter) {
        const upperCaseFilter = filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase(); // Capitalise only the first letter
        this.titleService.setTitle(`Our staff by ${upperCaseFilter} - Perpetua`);
        this.metaService.updateTag({ name: 'description', content: `Browse members at Perpetua by ${filter}` });
        this.groupMembersByCategory(filter);
      } else {
        this.titleService.setTitle('All staff - Perpetua');
        this.metaService.updateTag({ name: 'description', content: 'Browse all staff at Perpetua' });
        this.membersByCategory = [];
      }
    });

    this.members$.subscribe((members) => {
      this.allMembers = members;
      this.initializeVisibleMembers();
    });
  }

  ngOnDestroy(): void {
    this.translationHelper.unsubscribe();
  }

  initializeVisibleMembers(): void {
    this.visibleMembers = this.allMembers.slice(0, this.membersToLoad);
    this.loadMoreButtonVisible = this.visibleMembers.length < this.allMembers.length;
  }

  loadMoreMembers(): void {
    const newMembers = this.allMembers.slice(this.visibleMembers.length, this.visibleMembers.length + this.membersToLoad);
    this.visibleMembers = [...this.visibleMembers, ...newMembers];
    this.loadMoreButtonVisible = this.visibleMembers.length < this.allMembers.length;
  }

  sortMembers(type: string): void {
    this.memberService.sortMembers(type);
  }

  groupMembersByCategory(filter: string): void {
    // Using the members list to filter categories
    const members = this.allMembers;

    if (filter === 'office') {
      const locations = ['Christchurch', 'Auckland', 'Sydney', 'Yokohama'];
      this.membersByCategory = locations.map(location => ({
        category: this.sanitizer.bypassSecurityTrustHtml(location),
        members: members.filter((member: IMember) => member.location === location)
      }));
    } else if (filter === 'role') {
      const roleCategories = [
        { name: this.sanitizer.bypassSecurityTrustHtml('Administration <span style="font-family:sohne; font-weight:600; font-size:2.25rem; color:#000000;">&#38;</span> Management'), keywords: ['CEO', 'executive', 'assistant'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Design'), keywords: ['designer'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Software Engineering'), keywords: ['software', 'developer'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Accountant'), keywords: ['accountant'] },
        // { name: this.sanitizer.bypassSecurityTrustHtml('Data Analytics'), keywords: ['data'] },
      ];

      this.membersByCategory = roleCategories.map(category => ({
        category: category.name,
        members: members.filter((member: IMember) =>
          category.keywords.some(keyword => member.role?.toLowerCase().includes(keyword.toLowerCase()))
        )
      }));
    } else {
      this.membersByCategory = [];
    }
  }
}
