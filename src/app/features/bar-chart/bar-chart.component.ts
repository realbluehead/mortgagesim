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
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: [],
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @Input() yearlyData: { year: number; principal: number; interest: number }[] = [];
  @Input() isDark: boolean = true;
  @ViewChild('barChartContainer') chartContainer!: ElementRef;

  Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngAfterViewInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['yearlyData'] || changes['isDark']) && this.chartContainer) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const categories = this.yearlyData.map((d) => `Year ${d.year}`);
    const principalData = this.yearlyData.map((d) => d.principal);
    const interestData = this.yearlyData.map((d) => d.interest);

    const textColor = this.isDark ? '#E5E7EB' : '#111827';
    const labelColor = this.isDark ? '#D1D5DB' : '#374151';
    const gridColor = this.isDark ? '#374151' : '#E5E7EB';

    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          color: textColor,
        },
      },
      title: {
        text: undefined,
      },
      xAxis: {
        categories: categories,
        crosshair: true,
        labels: {
          style: {
            color: labelColor,
          },
        },
        lineColor: gridColor,
        tickColor: gridColor,
      },
      yAxis: {
        title: {
          text: 'Amount (€)',
          style: {
            color: labelColor,
          },
        },
        labels: {
          style: {
            color: labelColor,
          },
        },
        gridLineColor: gridColor,
      },
      tooltip: {
        backgroundColor: this.isDark ? '#1F2937' : '#FFFFFF',
        borderColor: this.isDark ? '#374151' : '#D1D5DB',
        headerFormat:
          '<span style="font-size:10px;color:' + textColor + '">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b style="color:' +
          textColor +
          '">€{point.y:,.2f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Principal',
          data: principalData,
          color: '#10B981',
          type: 'column',
        },
        {
          name: 'Interest',
          data: interestData,
          color: '#F97316',
          type: 'column',
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
