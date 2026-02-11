import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MortgageCalculationService {
  calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = years * 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  }

  calculateTotalInterest(principal: number, monthlyPayment: number, years: number): number {
    const totalPayments = years * 12;
    return totalPayments * monthlyPayment - principal;
  }

  calculateTotalCost(principal: number, totalInterest: number): number {
    return principal + totalInterest;
  }

  generateAmortizationSchedule(principal: number, annualRate: number, years: number): any[] {
    const schedule = [];
    const monthlyRate = annualRate / 12 / 100;
    const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, years);
    let remainingBalance = principal;

    for (let month = 1; month <= years * 12; month++) {
      const interestPortion = remainingBalance * monthlyRate;
      const principalPortion = monthlyPayment - interestPortion;
      remainingBalance -= principalPortion;

      schedule.push({
        month,
        date: new Date().toISOString().split('T')[0], // Placeholder for actual date logic
        monthlyPayment,
        principalPortion,
        interestPortion,
        totalPaid: monthlyPayment * month,
        remainingCapital: remainingBalance,
      });
    }

    return schedule;
  }
}
