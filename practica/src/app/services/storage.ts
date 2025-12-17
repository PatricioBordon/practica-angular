import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  set<T>(key: string, value: T): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;

    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;

    try {
      return JSON.parse(saved) as T;
    } catch (e) {
      console.warn(`Error parsing storage key "${key}"`, e);
      return defaultValue;
    }
  }

  remove(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }
}