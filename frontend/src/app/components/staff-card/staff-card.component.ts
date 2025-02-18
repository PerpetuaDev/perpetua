import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMember } from '../../../util/interfaces';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-staff-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-card.component.html',
  styleUrls: ['./staff-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StaffCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() members: IMember[] = [];
  shuffledMembers: IMember[][] = [];
  @ViewChildren('swiperRef') swiperContainers!: QueryList<ElementRef>;

  private swiperInstances: any[] = [];
  private hoverTimers: { [key: number]: any } = {};
  private initialIndices: { [key: number]: number } = {};

  ngOnInit() {
    if (this.members.length > 0) {
      this.generateShuffledMembers();
    }
  }

  ngAfterViewInit(): void {
    this.swiperContainers.forEach((swiperContainer: ElementRef, index: number) => {
      const swiperInstance = swiperContainer.nativeElement.swiper;
      if (swiperInstance) {
        this.swiperInstances[index] = swiperInstance;
      }
    });
  }

  ngOnDestroy(): void {
    Object.values(this.hoverTimers).forEach((timer) => clearInterval(timer));
  }

  getMemberImageUrl(member: IMember): string {
    return member.portrait_image?.url ? member.portrait_image.url : "../../../assets/images/img_n.a.png";
  }

  generateShuffledMembers(): void {
    const numberOfMembers = this.members.length;
    const groupSize = 6;

    for (let i = 0; i < groupSize; i++) {
      const resultArray: IMember[] = [];
      let index = i;

      while (index < numberOfMembers) {
        resultArray.push(this.members[index]);
        index += groupSize;
      }

      if (resultArray.length > 0) {
        this.shuffledMembers.push(resultArray);
      }
    }
  }

  onMouseEnter(index: number): void {
    const swiperInstance = this.swiperInstances[index];
    if (swiperInstance) {
      // this.initialIndices[index] = swiperInstance.activeIndex;
      swiperInstance.slideNext(2000);

      this.hoverTimers[index] = setInterval(() => {
        swiperInstance.slideNext(1000);
      }, 4000);
    }
  }

  onMouseLeave(index: number): void {
    const swiperInstance = this.swiperInstances[index];

    if (this.hoverTimers[index]) {
      clearInterval(this.hoverTimers[index]);
      delete this.hoverTimers[index];
    }

    if (swiperInstance) {
      swiperInstance.slideNext(this.initialIndices[index], 2000);
    }
  }
}
