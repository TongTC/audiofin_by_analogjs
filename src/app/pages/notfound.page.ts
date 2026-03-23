import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="text-xl mt-4">ไม่พบหน้าที่คุณต้องการ</p>
      <a routerLink="/" class="mt-6 text-blue-600 underline">กลับหน้าแรก</a>
    </div>
  `,
})
export default class PageNotFoundComponent {}
