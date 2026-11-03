import { TestBed } from '@angular/core/testing';
import { Language } from '../../core/i18n/language.enum';
import { LanguageService } from '../../core/i18n/language.service';
import { CrisisContactsComponent } from './crisis-contacts.component';

describe('CrisisContactsComponent', () => {
  const hrefs = () => {
    const fixture = TestBed.createComponent(CrisisContactsComponent);
    fixture.detectChanges();
    return Array.from(
      fixture.nativeElement.querySelectorAll('a.contact'),
      (link) => (link as HTMLAnchorElement).getAttribute('href'),
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisisContactsComponent],
    }).compileComponents();
  });

  it('always offers the emergency number as a phone link', () => {
    expect(hrefs()[0]).toBe('tel:112');
  });

  it('adds the national crisis line for the selected language', () => {
    TestBed.inject(LanguageService).setLanguage(Language.Czech);
    expect(hrefs()).toContain('tel:116123');
  });
});
