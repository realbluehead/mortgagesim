import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: [],
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @Input() principal: number = 0;
  @Input() totalInterest: number = 0;
  @Input() isDark: boolean = true;
  @ViewChild('pieChartContainer') chartContainer!: ElementRef;

  Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngAfterViewInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['principal'] || changes['totalInterest'] || changes['isDark']) &&
      this.chartContainer
    ) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const total = this.principal + this.totalInterest;
    const principalPercent = total > 0 ? (this.principal / total) * 100 : 0;
    const interestPercent = total > 0 ? (this.totalInterest / total) * 100 : 0;

    const textColor = this.isDark ? '#E5E7EB' : '#111827';
    const labelColor = this.isDark ? '#D1D5DB' : '#374151';

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          color: textColor,
        },
      },
      title: {
        text: undefined,
      },
      tooltip: {
        pointFormat: '<b>{point.name}</b>: €{point.y:,.2f} ({point.percentage:.1f}%)',
        backgroundColor: this.isDark ? '#1F2937' : '#FFFFFF',
        borderColor: this.isDark ? '#374151' : '#D1D5DB',
        style: {
          color: textColor,
        },
      },
      series: [
        {
          name: 'Amount',
          data: [
            {
              name: 'Principal',
              y: this.principal,
              color: '#10B981',
            },
            {
              name: 'Interest',
              y: this.totalInterest,
              color: '#F97316',
            },
          ],
          type: 'pie',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            color: labelColor,
            style: {
              fontSize: '12px',
              textOutline: 'none',
            },
          },
        },
      ],
      credits: {
        enabled: false,
      },
    };

    if (this.chartContainer) {
      Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
    }
  }
}
