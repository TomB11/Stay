import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { LegalPageComponent } from './legal-page.component';

describe('LegalPageComponent', () => {
  function render(legal: 'privacy' | 'terms'): HTMLElement {
    TestBed.configureTestingModule({
      imports: [LegalPageComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { legal } } } },
      ],
    });
    const fixture: ComponentFixture<LegalPageComponent> = TestBed.createComponent(LegalPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders every privacy section', () => {
    expect(render('privacy').querySelectorAll('.legal-section').length).toBe(6);
  });

  it('renders every terms section', () => {
    expect(render('terms').querySelectorAll('.legal-section').length).toBe(5);
  });
});
