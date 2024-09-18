import { Component, effect, inject } from '@angular/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerOptions,
  CapacitorBarcodeScannerTypeHintALLOption,
} from '@capacitor/barcode-scanner';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonRippleEffect,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  qrCodeOutline,
} from 'ionicons/icons';
import { ScannerService } from 'src/services/scanner.service';

type Code = string | undefined;

export enum CompareStatus {
  Same = 0,
  Different = 1,
  Partial = 2,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonIcon,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonRippleEffect,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class HomePage {
  private scannerService = inject(ScannerService);
  minCompareLength = 5;

  private options: CapacitorBarcodeScannerOptions = {
    scanButton: true,
    hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
  };

  codes: [Code, Code] = [undefined, undefined];

  activeIndex = 0;

  constructor() {
    addIcons({
      qrCodeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      alertCircleOutline,
    });

    effect(() => {
      this.assignCode(this.scannerService.code());
    });
  }

  private assignCode = (code: string) => {
    if (!code) return;
    this.codes[this.activeIndex] = code;
    this.activeIndex = Number(!this.activeIndex);
  };

  getCompareStatus = () => {
    const [first, second] = this.codes;

    if (first === second) {
      return CompareStatus.Same;
    }
    const firstStr = first?.toString() ?? '';
    const secondStr = second?.toString() ?? '';

    const minLength = Math.min(firstStr?.length, secondStr?.length);

    for (let i = minLength; i >= this.minCompareLength; i--) {
      if (firstStr.substring(0, i) === secondStr.substring(0, i)) {
        return CompareStatus.Partial;
      }
    }
    return CompareStatus.Different;
  };

  getContentColor = () => {
    const status = this.getCompareStatus();
    switch (status) {
      case CompareStatus.Same:
        return 'success';
      case CompareStatus.Different:
        return 'danger';
      case CompareStatus.Partial:
        return 'warning';
      default:
        return undefined;
    }
  };

  getContetIcon = () => {
    const status = this.getCompareStatus();
    switch (status) {
      case CompareStatus.Same:
        return 'checkmark-circle-outline';
      case CompareStatus.Different:
        return 'close-circle-outline';
      case CompareStatus.Partial:
        return 'alert-circle-outline';
      default:
        return undefined;
    }
  };

  getContentText = () => {
    const status = this.getCompareStatus();
    switch (status) {
      case CompareStatus.Same:
        return 'Los códigos coinciden';
      case CompareStatus.Different:
        return 'Los códigos no coinciden';
      case CompareStatus.Partial:
        return 'Los códigos coinciden parcialmente';
      default:
        return '';
    }
  };

  cleanBarcodes = () => {
    this.codes = [undefined, undefined];
  };

  //Camera Barcode Scanner
  public async scanBarcode(): Promise<void> {
    this.assignCode((await CapacitorBarcodeScanner.scanBarcode(this.options)).ScanResult);
  }
}
