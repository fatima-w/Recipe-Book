import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourGroupsItemComponent } from './your-groups-item.component';

describe('YourGroupsItemComponent', () => {
  let component: YourGroupsItemComponent;
  let fixture: ComponentFixture<YourGroupsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourGroupsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourGroupsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
