import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('404 - Page Not Found');
    this.metaService.updateTag({
      name: 'description',
      content: 'This page does not exist. Please return to the homepage.',
    });

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }
}
