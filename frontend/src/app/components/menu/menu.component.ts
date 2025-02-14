// Libraries
import { Component, HostListener, OnInit, ViewEncapsulation, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Components
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { MenuService } from '../../shared/menu.service';
import { ProjectService } from '../../shared/project.service';
import { ArticleService } from '../../shared/article.service';
import { IProject } from '../../../util/interfaces';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, RouterLink, TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class MenuComponent implements OnInit {
  projects$: Observable<IProject[]>;
  filteredProjects$: Observable<IProject[]>;
  projectTitles: string[] = [
    'MyOCP App',
    'Duncan Taylor Builders Website',
    'Perpetua Website',
    'OCP Group Website',
    'Ecoglo Cost-calculator',
    'First Class First Aid Website'
  ];
  selectedMenuItem: string | null = null;
  searchProjects: string = '';
  searchContent: string = '';
  @ViewChild('projectsSearchBar') projectsSearchBar!: SearchBarComponent;
  @ViewChild('articlesSearchBar') articlesSearchBar!: SearchBarComponent;
  private clickedItem: string | null = null;

  projectService: ProjectService = inject(ProjectService);
  articleService: ArticleService = inject(ArticleService);

  constructor(
    private translateService: TranslateService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.projects$ = this.projectService.projects$;
    this.filteredProjects$ = this.projects$.pipe(
      map((projects) =>
        this.projectTitles
          .map((title) => projects.find((project) => project.project_title === title))
          .filter((project) => !!project) as IProject[]
      )
    );
  }

  ngOnInit(): void {
    this.searchProjects = this.translateService.instant('menu.search.projects');
    this.searchContent = this.translateService.instant('menu.search.articles');

    this.translateService.onLangChange.subscribe(() => {
      this.searchProjects = this.translateService.instant('menu.search.projects');
      this.searchContent = this.translateService.instant('menu.search.articles');
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.highlightActiveMenuItem(event.urlAfterRedirects);
      }
    });
  }

  clearSelectedMenu() {
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => item.classList.remove('selected', 'active'));
    this.selectedMenuItem = null;
  }

  sortProjects(type: string): void {
    this.projectService.filterProjects(type);
  }

  sortArticles(type: string): void {
    this.articleService.sortArticles(type);
  }

  onKeyDown(e: KeyboardEvent, type: string): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.sortProjects(type);
    }
  }

  onMenuHover(menuItem: string, event: Event): void {
    event.stopPropagation();

    if (this.projectsSearchBar) {
      this.projectsSearchBar.removeBottomBorder();
    }
    if (this.articlesSearchBar) {
      this.articlesSearchBar.removeBottomBorder();
    }

    this.resetSubmenusAndChevron();

    const correspondingSubmenu = document.getElementById(`submenu-${menuItem}`);
    const correspondingChevron = document.querySelector(`#${menuItem} + .chevron`);
    if (correspondingSubmenu) {
      correspondingSubmenu.classList.add('visible');

      const submenuBox = correspondingSubmenu.querySelector('.submenu-box');
      if (submenuBox) {
        submenuBox.classList.add('visible');
      }
    }
    if (correspondingChevron) {
      correspondingChevron.classList.add('visible');
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.menu-container') && !targetElement.closest('.submenu-container')) {
      this.resetSubmenusAndChevron();
      this.selectedMenuItem = null;
    }
  }

  private resetSubmenusAndChevron() {
    const submenus = document.querySelectorAll('.submenu-container');
    submenus.forEach(submenu => submenu.classList.remove('visible'));

    const chevrons = document.querySelectorAll('.chevron');
    chevrons.forEach(chevron => chevron.classList.remove('visible'));
  }

  onMenuHide(menuItem: string, event: Event): void {
    event.stopPropagation();
    this.clickedItem = menuItem;

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('selected', 'active'));

    const clickedMenuItem = document.getElementById(menuItem);
    if (clickedMenuItem) {
      clickedMenuItem.classList.add('selected', 'active');
    }

    const submenus = document.querySelectorAll('.submenu-container');
    submenus.forEach(submenu => submenu.classList.remove('visible'));

    const chevrons = document.querySelectorAll('.chevron');
    chevrons.forEach(chevron => chevron.classList.remove('visible'));

    this.selectedMenuItem = menuItem;
  }

  onKeyDownMenuHide(e: KeyboardEvent, menuItem: string): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onMenuHide(menuItem, e);
    }
  }

  handleClick(sortType: string, menuItem: string, event: Event): void {
    event.stopPropagation();

    if (sortType === 'article' || sortType === 'news' || sortType === 'blog') {
      this.sortArticles(sortType);
    } else {
      this.sortProjects(sortType);
    }

    this.onMenuHide(menuItem, event);
  }

  handleKeydown(event: KeyboardEvent, sortType: string, menuItem: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sortProjects(sortType);
      this.onMenuHide(menuItem, event);
    }
  }

  private highlightActiveMenuItem(currentUrl: string): void {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('selected', 'active'));

    const matchingMenuItemId = this.getMenuItemIdFromUrl(currentUrl);
    if (matchingMenuItemId) {
      const matchingMenuItem = document.getElementById(matchingMenuItemId);
      if (matchingMenuItem) {
        matchingMenuItem.classList.add('selected', 'active');
      }
    }
  }

  private getMenuItemIdFromUrl(url: string): string | null {
    if (url.startsWith('/projects')) {
      return 'projects';
    } else if (url.startsWith('/services')) {
      return 'services';
    } else if (url.startsWith('/about')) {
      return 'about';
    } else if (url.startsWith('/articles')) {
      return 'blog';
    } else if (url.startsWith('/contact')) {
      return 'contact';
    }
    return null;
  }

  onSearchResultSelected(): void {
    this.resetSubmenusAndChevron();
    this.selectedMenuItem = null;
  }
}