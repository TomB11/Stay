import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NowSupportComponent } from './now-support.component';

describe('NowSupportComponent', () => {
  let fixture: ComponentFixture<NowSupportComponent>;
  const root = () => fixture.nativeElement as HTMLElement;
  const click = (selector: string) => {
    (root().querySelector(selector) as HTMLElement).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowSupportComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NowSupportComponent);
    fixture.detectChanges();
  });

  it('starts breathing immediately without any input', () => {
    expect(root().querySelector('app-breathing-guide')).toBeTruthy();
    expect(root().querySelector('input, textarea')).toBeNull();
  });

  it('asks whether it is easier and offers grounding and help', () => {
    click('app-breathing-guide .done');
    expect(root().querySelectorAll('.option').length).toBe(5);

    click('.option:nth-child(3)');
    expect(root().querySelector('app-grounding-guide')).toBeTruthy();
  });

  it('offers muscle relaxation after the check', () => {
    click('app-breathing-guide .done');
    click('.option:nth-child(4)');
    expect(root().querySelector('app-relaxation-guide')).toBeTruthy();
  });

  it('opens crisis help from the breathing screen', () => {
    click('.btn-link');
    expect(root().querySelector('app-crisis-help')).toBeTruthy();
  });
});
