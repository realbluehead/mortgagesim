import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-amortization-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amortization-schedule.component.html',
  styleUrls: [],
})
export class AmortizationScheduleComponent {
  @Input() schedule!: Signal<any[]>;

  get scheduleItems() {
    return this.schedule?.() || [];
  }
}
