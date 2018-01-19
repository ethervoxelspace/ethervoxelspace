import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceExplorerComponent } from './place-explorer.component';

describe('PlaceExplorerComponent', () => {
  let component: PlaceExplorerComponent;
  let fixture: ComponentFixture<PlaceExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
