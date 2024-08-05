import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourRecipeItemComponent } from './your-recipe-item.component';

describe('YourRecipeItemComponent', () => {
  let component: YourRecipeItemComponent;
  let fixture: ComponentFixture<YourRecipeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourRecipeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourRecipeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
