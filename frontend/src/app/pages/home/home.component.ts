import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from "./components/projects/projects.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { NewsComponent } from "./components/news/news.component";
import { ServicesComponent } from './components/services/services.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProjectsComponent,
    ServicesComponent,
    ClientsComponent,
    NewsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
