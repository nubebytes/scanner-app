import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  codeScanned = new BehaviorSubject<string>('');

  /**
   * Force the code to be updated even if it is the same.
   *
   * @memberof ScannerService
   */
  code = signal<string>('', { equal: () => false });

  constructor() {
    this.listenForScan();
  }

  private listenForScan() {
    let newCode = '';

    fromEvent<KeyboardEvent>(document, 'keypress').subscribe({
      next: event => {
        if (event.key !== 'Enter') {
          newCode += event.key;
          return;
        }

        this.codeScanned.next(newCode);
        this.code.set(newCode);
        newCode = '';
      },
    });
  }
}
