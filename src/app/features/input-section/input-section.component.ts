import { Component, Input, OnInit, effect, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-section.component.html',
  styleUrls: [],
})
export class InputSectionComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() set initialStartDate(value: Date | null) {
    if (value && this.startDate() !== value) {
      this.startDate.set(value);
    }
  }

  @Input() set initialPrincipal(value: number) {
    if (value && this.principal() !== value) {
      this.principal.set(value);
    }
  }

  @Input() set initialInterestRate(value: number) {
    if (value && this.interestRate() !== value) {
      this.interestRate.set(value);
    }
  }

  @Input() set initialDuration(value: number) {
    if (value && this.duration() !== value) {
      this.duration.set(value);
    }
  }

  // Form signals - source of truth
  startDate = signal<Date | null>(null);
  principal = signal<number>(200000);
  interestRate = signal<number>(5);
  duration = signal<number>(30);

  // Output signals
  startDateChange = output<Date | null>();
  principalChange = output<number>();
  interestRateChange = output<number>();
  durationChange = output<number>();

  // Form group
  mortgageForm: FormGroup;

  constructor() {
    // Create reactive form
    this.mortgageForm = this.fb.group({
      startDate: [null],
      principal: [200000, [Validators.required, Validators.min(1)]],
      interestRate: [5, [Validators.required, Validators.min(0)]],
      duration: [30, [Validators.required, Validators.min(1)]],
    });

    // Sync signal changes to form and emit outputs
    effect(() => {
      const date = this.startDate();
      this.mortgageForm.get('startDate')?.setValue(date, { emitEvent: false });
      this.startDateChange.emit(date);
    });

    effect(() => {
      const value = this.principal();
      this.mortgageForm.get('principal')?.setValue(value, { emitEvent: false });
      this.principalChange.emit(value);
    });

    effect(() => {
      const value = this.interestRate();
      this.mortgageForm.get('interestRate')?.setValue(value, { emitEvent: false });
      this.interestRateChange.emit(value);
    });

    effect(() => {
      const value = this.duration();
      this.mortgageForm.get('duration')?.setValue(value, { emitEvent: false });
      this.durationChange.emit(value);
    });
  }

  ngOnInit(): void {
    // Initialize is handled by setters now
  }

  onStartDateInput(value: string): void {
    if (value) {
      this.startDate.set(new Date(value));
    }
  }

  onPrincipalInput(value: number): void {
    if (value > 0) {
      this.principal.set(value);
    }
  }

  onInterestRateInput(value: number): void {
    if (value >= 0) {
      this.interestRate.set(value);
    }
  }

  onDurationInput(value: number): void {
    if (value > 0) {
      this.duration.set(value);
    }
  }
}
