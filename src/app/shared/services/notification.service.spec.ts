import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  class MockMatSnackBar {
    open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
      return undefined;
    }
  }

  let mockMatSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {
          provide: MatSnackBar,
          useClass: MockMatSnackBar
        }
      ]
    });
    mockMatSnackBar = TestBed.get(MatSnackBar);
  });

  it('should be created', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));

  it('should trigger snack bar toast for showSuccessToast()', inject([NotificationService], (service: NotificationService) => {
    const clearSessionSpy: jasmine.Spy = spyOn(mockMatSnackBar, 'open');
    const message: string = 'message';
    const actionButtonLabel: string = 'label';
    const actionButtonFn: (value: void) => void = undefined;
    expect(service.showSuccessToast(message, actionButtonLabel, actionButtonFn)).toBeUndefined();
    expect(clearSessionSpy).toHaveBeenCalled();
  }));

  it('should trigger snack bar toast for showErrorToast()', inject([NotificationService], (service: NotificationService) => {
    const clearSessionSpy: jasmine.Spy = spyOn(mockMatSnackBar, 'open');
    const message: string = 'message';
    const actionButtonLabel: string = 'label';
    const actionButtonFn: (value: void) => void = undefined;
    expect(service.showErrorToast(message, actionButtonLabel, actionButtonFn)).toBeUndefined();
    expect(clearSessionSpy).toHaveBeenCalled();
  }));

  it('should trigger snack bar toast for showWarningToast()', inject([NotificationService], (service: NotificationService) => {
    const clearSessionSpy: jasmine.Spy = spyOn(mockMatSnackBar, 'open');
    const message: string = 'message';
    const actionButtonLabel: string = 'label';
    const actionButtonFn: (value: void) => void = undefined;
    expect(service.showWarningToast(message, actionButtonLabel, actionButtonFn)).toBeUndefined();
    expect(clearSessionSpy).toHaveBeenCalled();
  }));
});
