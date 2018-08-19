import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppAnimationModule } from '../../../core/animation/app-animation.module';
import { AppMaterialModule } from '../../../core/material/app-material.module';

import { ForceDirectedGraphCardComponent } from './force-directed-graph-card.component';

describe('ForceDirectedGraphCardComponent', () => {
  let component: ForceDirectedGraphCardComponent;
  let fixture: ComponentFixture<ForceDirectedGraphCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForceDirectedGraphCardComponent],
      imports: [
        AppAnimationModule,
        AppMaterialModule,
        NgxChartsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDirectedGraphCardComponent);
    component = fixture.componentInstance;
    component.title = 'Graph Card';
    component.graph = {
      links: [
        {
          source: {
            name: 'abc'
          },
          target: 'def'
        }
      ],
      nodes: [
        {
          value: 'abc'
        },
        {
          value: 'def'
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
