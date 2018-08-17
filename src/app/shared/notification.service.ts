import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBarSuccessConfig: MatSnackBarConfig = new MatSnackBarConfig();
  private readonly snackBarErrorConfig: MatSnackBarConfig = new MatSnackBarConfig();
  private readonly snackBarWarningConfig: MatSnackBarConfig = new MatSnackBarConfig();

  constructor(private snackBar: MatSnackBar) {
    this.snackBarSuccessConfig = this.getDefaultSnackBarConfig();
    this.snackBarSuccessConfig.panelClass = ['snackbar-success', 'snackbar'];

    this.snackBarErrorConfig = this.getDefaultSnackBarConfig();
    this.snackBarErrorConfig.panelClass = ['snackbar-error', 'snackbar'];

    this.snackBarWarningConfig = this.getDefaultSnackBarConfig();
    this.snackBarWarningConfig.panelClass = ['snackbar-warning', 'snackbar'];
  }

  showSuccessToast(message: string, actionButtonLabel?: string, actionButtonFn?: (value: void) => void): void {
    this.showToast(message, actionButtonLabel, actionButtonFn, this.snackBarSuccessConfig);
  }

  showErrorToast(message: string, actionButtonLabel?: string, actionButtonFn?: (value: void) => void): void {
    this.showToast(message, actionButtonLabel, actionButtonFn, this.snackBarErrorConfig);
  }

  showWarningToast(message: string, actionButtonLabel?: string, actionButtonFn?: (value: void) => void): void {
    this.showToast(message, actionButtonLabel, actionButtonFn, this.snackBarWarningConfig);
  }

  private getDefaultSnackBarConfig(): MatSnackBarConfig {
    const snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();
    snackBarConfig.verticalPosition = 'bottom';
    snackBarConfig.horizontalPosition = 'left';
    snackBarConfig.duration = 3000;
    return snackBarConfig;
  }

  private showToast(message: string, actionButtonLabel: string, actionButtonFn: (value: void) => void,
                    snackBarConfig: MatSnackBarConfig) {
    const snackBarRef: MatSnackBarRef<SimpleSnackBar> =
      this.snackBar.open(message, actionButtonLabel, snackBarConfig);

    const hasAction: boolean = !!actionButtonFn;
    if (hasAction) {
      snackBarRef.onAction().subscribe(actionButtonFn);
    }
  }

}
