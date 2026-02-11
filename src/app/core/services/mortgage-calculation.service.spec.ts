import { TestBed } from '@angular/core/testing';
import { MortgageCalculationService } from './mortgage-calculation.service';

describe('MortgageCalculationService', () => {
  let service: MortgageCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortgageCalculationService);
  });

  it('should calculate monthly payment correctly', () => {
    const principal = 200000;
    const annualRate = 5;
    const years = 30;
    const monthlyPayment = service.calculateMonthlyPayment(principal, annualRate, years);
    expect(monthlyPayment).toBeCloseTo(1073.64, 2);
  });

  it('should calculate total interest correctly', () => {
    const principal = 200000;
    const annualRate = 5;
    const years = 30;
    const monthlyPayment = service.calculateMonthlyPayment(principal, annualRate, years);
    const totalInterest = service.calculateTotalInterest(principal, monthlyPayment, years);
    expect(totalInterest).toBeCloseTo(186510.57, 2);
  });

  it('should generate amortization schedule correctly', () => {
    const principal = 200000;
    const annualRate = 5;
    const years = 30;
    const schedule = service.generateAmortizationSchedule(principal, annualRate, years);
    expect(schedule.length).toBe(360);
    expect(schedule[0].monthlyPayment).toBeCloseTo(1073.64, 2);
  });
});
