import { Component, inject, signal, computed, effect, OnInit, DOCUMENT } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { InputSectionComponent } from './features/input-section/input-section.component';
import { SummaryDashboardComponent } from './features/summary-dashboard/summary-dashboard.component';
import { PieChartComponent } from './features/pie-chart/pie-chart.component';
import { AmortizationScheduleComponent } from './features/amortization-schedule/amortization-schedule.component';
import { BarChartComponent } from './features/bar-chart/bar-chart.component';
import { MortgageCalculationService } from './core/services/mortgage-calculation.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InputSectionComponent,
    SummaryDashboardComponent,
    PieChartComponent,
    AmortizationScheduleComponent,
    BarChartComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private calcService = inject(MortgageCalculationService);
  private storageService = inject(StorageService);
  private document = inject(DOCUMENT);

  // Mortgage input signals
  startDate = signal<Date | null>(null);
  principal = signal<number>(200000);
  interestRate = signal<number>(5);
  duration = signal<number>(30);

  // Theme signal
  isDark = signal<boolean>(true);

  // Computed calculations
  monthlyPayment = computed(() =>
    this.calcService.calculateMonthlyPayment(
      this.principal(),
      this.interestRate(),
      this.duration(),
    ),
  );

  totalInterest = computed(() =>
    this.calcService.calculateTotalInterest(
      this.principal(),
      this.monthlyPayment(),
      this.duration(),
    ),
  );

  totalCost = computed(() =>
    this.calcService.calculateTotalCost(this.principal(), this.totalInterest()),
  );

  amortizationSchedule = computed(() =>
    this.calcService.generateAmortizationSchedule(
      this.principal(),
      this.interestRate(),
      this.duration(),
    ),
  );

  yearlyData = computed(() => {
    const schedule = this.amortizationSchedule();
    const yearly: { year: number; principal: number; interest: number }[] = [];

    for (let year = 1; year <= this.duration(); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      const startMonth = (year - 1) * 12;
      const endMonth = year * 12;

      for (let month = startMonth; month < endMonth && month < schedule.length; month++) {
        yearlyPrincipal += schedule[month].principalPortion;
        yearlyInterest += schedule[month].interestPortion;
      }

      yearly.push({ year, principal: yearlyPrincipal, interest: yearlyInterest });
    }

    return yearly;
  });

  constructor() {
    // Auto-save to localStorage whenever any mortgage signal changes
    effect(() => {
      this.principal();
      this.interestRate();
      this.duration();
      this.startDate();
      this.saveToLocalStorage();
    });

    // Auto-save theme preference whenever it changes
    effect(() => {
      this.isDark();
      this.storageService.saveThemePreference(this.isDark());
      // Apply dark class to html element
      if (this.isDark()) {
        this.document.documentElement.classList.add('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
      }
    });
  }

  ngOnInit(): void {
    // Load data from localStorage on app initialization
    this.loadFromLocalStorage();
    this.loadThemePreference();
    // Apply dark class to html element on init
    if (this.isDark()) {
      this.document.documentElement.classList.add('dark');
    }
  }

  private saveToLocalStorage(): void {
    this.storageService.saveMortgageData({
      principal: this.principal(),
      interestRate: this.interestRate(),
      duration: this.duration(),
      startDate: this.startDate()?.toISOString() || null,
    });
  }

  private loadFromLocalStorage(): void {
    const data = this.storageService.loadMortgageData();
    if (data) {
      this.principal.set(data.principal);
      this.interestRate.set(data.interestRate);
      this.duration.set(data.duration);
      if (data.startDate) {
        this.startDate.set(new Date(data.startDate));
      }
    }
  }

  private loadThemePreference(): void {
    const isDark = this.storageService.loadThemePreference();
    this.isDark.set(isDark);
  }

  toggleDarkMode(): void {
    this.isDark.set(!this.isDark());
  }

  exportData(): void {
    const jsonData = this.storageService.exportAsJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mortgage-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const importedData = this.storageService.importFromJSON(content);
          if (importedData) {
            this.principal.set(importedData.principal);
            this.interestRate.set(importedData.interestRate);
            this.duration.set(importedData.duration);
            if (importedData.startDate) {
              this.startDate.set(new Date(importedData.startDate));
            }
            alert('Mortgage data imported successfully!');
          } else {
            alert('Error importing mortgage data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}
