import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppAnimationModule } from '../../../core/animation/app-animation.module';
import { AppMaterialModule } from '../../../core/material/app-material.module';

import { BubbleChartCardComponent } from './bubble-chart-card.component';

describe('BubbleChartCardComponent', () => {
  let component: BubbleChartCardComponent;
  let fixture: ComponentFixture<BubbleChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BubbleChartCardComponent],
      imports: [
        AppAnimationModule,
        AppMaterialModule,
        NgxChartsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartCardComponent);
    component = fixture.componentInstance;
    component.title = 'Bubble Chart Card';
    component.xAxisLabel = 'Age';
    component.yAxisLabel = 'Weight';
    component.results = [
      {
        name: '',
        series: [
          {
            name: 'Tammy',
            x: 10,
            y: 20,
            r: 5
          },
          {
            name: 'Evan',
            x: 15,
            y: 25,
            r: 15
          }
        ]
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
