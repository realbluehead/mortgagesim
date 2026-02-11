import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-dashboard.component.html',
  styleUrls: [],
})
export class SummaryDashboardComponent {
  @Input() monthlyPayment!: Signal<number>;
  @Input() totalInterest!: Signal<number>;
  @Input() totalCost!: Signal<number>;
}
