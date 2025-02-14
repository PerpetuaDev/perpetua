import { Component } from '@angular/core';
import { SlidesComponent } from "./components/slides/slides.component";

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SlidesComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
}
