import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppAnimationModule } from './animation/app-animation.module';
import { throwIfAlreadyLoaded2 } from './guards/module-import-guard';
import { AppMaterialModule } from './material/app-material.module';
import { NoContentComponent } from './no-content/no-content.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AppAnimationModule,
    AppMaterialModule
  ],
  declarations: [
    NoContentComponent
  ],
  exports: [
    NoContentComponent
  ],
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    throwIfAlreadyLoaded2(parentModule, 'CoreModule');
  }
}
