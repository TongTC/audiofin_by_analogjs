import { Component, computed, input } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown',
  standalone: true,
  template: `
    <section class="analog-markdown" [innerHTML]="renderedHtml()"></section>
  `,
})
export class MarkdownComponent {
  content = input<string>('');

  renderedHtml = computed(() => {
    const markdown = this.content();
    if (!markdown) {
      return '';
    }

    const parsed = marked.parse(markdown);
    return typeof parsed === 'string' ? parsed : '';
  });
}
