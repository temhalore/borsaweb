import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPriceBySymbolComponent } from './get-price-by-symbol.component';

describe('GetPriceBySymbolComponent', () => {
  let component: GetPriceBySymbolComponent;
  let fixture: ComponentFixture<GetPriceBySymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPriceBySymbolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPriceBySymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
