import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AccountSettingsComponent } from './account-settings.component';

describe('AccountSettingsComponent', () => {
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let root: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AccountSettingsComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('asks for confirmation before deleting the account', () => {
    expect(root.querySelector('.danger')).toBeNull();
    (root.querySelector('.danger-outline') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(root.querySelector('.danger')).toBeTruthy();
    expect(root.querySelector('[role="alert"]')).toBeTruthy();
  });
});
