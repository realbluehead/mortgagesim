import { Injectable } from '@angular/core';

export interface MortgageData {
  startDate: string | null;
  principal: number;
  interestRate: number;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly STORAGE_KEY = 'mortgageData';
  private readonly THEME_KEY = 'isDarkTheme';

  saveMortgageData(data: MortgageData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving mortgage data:', error);
    }
  }

  loadMortgageData(): MortgageData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error loading mortgage data:', error);
      return null;
    }
  }

  exportAsJSON(): string {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return data;
    }
    return JSON.stringify({ principal: 0, interestRate: 0, duration: 0, startDate: null });
  }

  importFromJSON(jsonData: string): MortgageData | null {
    try {
      const data = JSON.parse(jsonData) as MortgageData;
      // Validate the data structure
      if (
        typeof data.principal === 'number' &&
        typeof data.interestRate === 'number' &&
        typeof data.duration === 'number'
      ) {
        this.saveMortgageData(data);
        return data;
      }
      throw new Error('Invalid mortgage data format');
    } catch (error) {
      console.error('Error importing mortgage data:', error);
      return null;
    }
  }

  clearMortgageData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing mortgage data:', error);
    }
  }

  saveThemePreference(isDark: boolean): void {
    try {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  loadThemePreference(): boolean {
    try {
      const theme = localStorage.getItem(this.THEME_KEY);
      return theme ? JSON.parse(theme) : true; // Default to dark theme
    } catch (error) {
      console.error('Error loading theme preference:', error);
      return true; // Default to dark theme
    }
  }
}
