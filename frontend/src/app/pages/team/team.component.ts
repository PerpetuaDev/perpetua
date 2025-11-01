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
    const members = this.allMembers;

    if (filter === 'office') {
      const locations = ['Christchurch', 'Auckland', 'Sydney', 'Yokohama'];
      this.membersByCategory = locations
        .map(location => ({
          category: this.sanitizer.bypassSecurityTrustHtml(location),
          members: members.filter(m => m.location === location)
        }))
        .filter(g => g.members.length > 0); // <- remove empties
    } else if (filter === 'role') {
      const roleCategories = [
        { name: this.sanitizer.bypassSecurityTrustHtml('Administration <span class="ampersand" style="font-family:Sohne; font-weight: 600;">&#38;</span> Management'), keywords: ['CEO', 'executive', 'assistant'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Design'), keywords: ['designer'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Software Engineering'), keywords: ['software', 'developer'] },
        { name: this.sanitizer.bypassSecurityTrustHtml('Accountant'), keywords: ['accountant'] },
      ];

      this.membersByCategory = roleCategories
        .map(cat => ({
          category: cat.name,
          members: members.filter(m =>
            cat.keywords.some(k => m.role?.toLowerCase().includes(k.toLowerCase()))
          )
        }))
        .filter(g => g.members.length > 0); // <- remove empties
    } else {
      this.membersByCategory = [];
    }
  }

}
