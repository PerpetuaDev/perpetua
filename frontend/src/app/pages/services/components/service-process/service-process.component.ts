import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProcessData } from './service-process-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})

export class ServiceProcessComponent {
  serviceProcessData = ServiceProcessData;
  constructor(private router: Router) { }
}
