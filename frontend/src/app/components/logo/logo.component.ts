// Libraries
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
// Service
import { MenuService } from '../../shared/menu.service';
import { ProjectService } from '../../shared/project.service';
import { ArticleService } from '../../shared/article.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  projectService: ProjectService = inject(ProjectService);
  articleService: ArticleService = inject(ArticleService);

  constructor(private menuService: MenuService) { }

  onLogoClick() {
    this.menuService.resetMenu();
    this.articleService.sortArticles('all');
    this.projectService.filterProjects('all');
  }

  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    this.onLogoClick();
  }
}