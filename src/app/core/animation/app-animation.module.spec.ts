import { AppAnimationModule } from './app-animation.module';

describe('AppAnimationModule', () => {
  let appAnimationModule: AppAnimationModule;

  beforeEach(() => {
    appAnimationModule = new AppAnimationModule();
  });

  it('should create an instance', () => {
    expect(appAnimationModule).toBeTruthy();
  });
});
