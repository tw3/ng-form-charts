import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDirectedGraphCardComponent } from './force-directed-graph-card.component';

describe('ForceDirectedGraphCardComponent', () => {
  let component: ForceDirectedGraphCardComponent;
  let fixture: ComponentFixture<ForceDirectedGraphCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForceDirectedGraphCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDirectedGraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
