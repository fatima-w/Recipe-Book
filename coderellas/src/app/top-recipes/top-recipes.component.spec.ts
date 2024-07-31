import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRecipesComponent } from './top-recipes.component';

describe('TopRecipesComponent', () => {
  let component: TopRecipesComponent;
  let fixture: ComponentFixture<TopRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
