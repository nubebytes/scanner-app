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
import { checkmarkCircleOutline, closeCircleOutline, qrCodeOutline } from 'ionicons/icons';
import { ScannerService } from 'src/services/scanner.service';

type Code = string | undefined;

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

  isSameCode = () => {
    const [first, second] = this.codes;
    return first === second;
  };

  getContentColor = () => {
    const [first, second] = this.codes;
    if (!first || !second) return undefined;
    return this.isSameCode() ? 'success' : 'danger';
  };

  cleanBarcodes = () => {
    this.codes = [undefined, undefined];
  };

  //Camera Barcode Scanner
  public async scanBarcode(): Promise<void> {
    this.assignCode((await CapacitorBarcodeScanner.scanBarcode(this.options)).ScanResult);
  }
}
