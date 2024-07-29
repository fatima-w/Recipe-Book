import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourRecipesComponent } from './your-recipes.component';

describe('YourRecipesComponent', () => {
  let component: YourRecipesComponent;
  let fixture: ComponentFixture<YourRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
