import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMetadataComponent } from './update-metadata.component';

describe('UpdateMetadataComponent', () => {
  let component: UpdateMetadataComponent;
  let fixture: ComponentFixture<UpdateMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
