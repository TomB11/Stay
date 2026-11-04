import { TestBed } from '@angular/core/testing';
import { PromptStartersComponent } from './prompt-starters.component';

describe('PromptStartersComponent', () => {
  it('emits the translated text of the picked starter', () => {
    TestBed.configureTestingModule({ imports: [PromptStartersComponent] });
    const fixture = TestBed.createComponent(PromptStartersComponent);
    fixture.componentRef.setInput('keys', ['phStarterNow1', 'phStarterNow2']);
    fixture.detectChanges();
    const picked: string[] = [];
    fixture.componentInstance.picked.subscribe((text) => picked.push(text));
    const chips = fixture.nativeElement.querySelectorAll('.chip') as NodeListOf<HTMLButtonElement>;
    expect(chips.length).toBe(2);
    chips[0].click();
    expect(picked.length).toBe(1);
    expect(picked[0].length).toBeGreaterThan(0);
  });
});