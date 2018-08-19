import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppAnimationModule } from '../../../core/animation/app-animation.module';
import { AppMaterialModule } from '../../../core/material/app-material.module';

import { HorizontalBarChartCardComponent } from './horizontal-bar-chart-card.component';

describe('HorizontalBarChartCardComponent', () => {
  let component: HorizontalBarChartCardComponent;
  let fixture: ComponentFixture<HorizontalBarChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalBarChartCardComponent],
      imports: [
        AppAnimationModule,
        AppMaterialModule,
        NgxChartsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalBarChartCardComponent);
    component = fixture.componentInstance;
    component.title = 'Horizontal Bar Chart Card';
    component.xAxisLabel = 'Age';
    component.yAxisLabel = 'Name';
    component.results = [
      {
        name: 'Tammy',
        value: 10
      },
      {
        name: 'Evan',
        value: 15
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
