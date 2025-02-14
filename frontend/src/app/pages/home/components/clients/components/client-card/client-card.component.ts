import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IClient } from '../../../../../../../util/interfaces';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent {
  @Input() clients: IClient[] = [];
  @Output() clientSelected = new EventEmitter<number>();

  selectClient(index: number): void {
    this.clientSelected.emit(index);
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectClient(index);
    }
  }

  emptySpaces() {
    return new Array(9 - this.clients.length).fill(null);
  }
}
