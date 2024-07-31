import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRecipesItemComponent } from './top-recipes-item.component';

describe('TopRecipesItemComponent', () => {
  let component: TopRecipesItemComponent;
  let fixture: ComponentFixture<TopRecipesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopRecipesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRecipesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
