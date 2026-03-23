import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  currentMember,
  isLoggedIn,
  loginMember,
  logoutMember,
  registerMember,
} from '../../auth.store';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="member-page">
      <section class="member-card">
        <h1>ระบบสมาชิก</h1>

        @if (isLoggedIn()) {
          <div class="profile-box">
            <h2>ยินดีต้อนรับ {{ currentMember()?.name }}</h2>
            <p><strong>อีเมล:</strong> {{ currentMember()?.email }}</p>
            <p>
              <strong>บทบาท:</strong>
              {{ currentMember()?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก' }}
            </p>
            <p><strong>Member ID:</strong> {{ currentMember()?.id }}</p>
            <div class="actions">
              <a routerLink="/" class="outline-btn">กลับไปหน้าหลัก</a>
              <a routerLink="/profile" class="outline-btn">แก้ไขโปรไฟล์</a>
              <button type="button" class="primary-btn" (click)="handleLogout()">ออกจากระบบ</button>
            </div>
          </div>
        } @else {
          <div class="mode-switch">
            <button
              type="button"
              class="mode-btn"
              [class.mode-active]="mode() === 'login'"
              (click)="mode.set('login')"
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              class="mode-btn"
              [class.mode-active]="mode() === 'register'"
              (click)="mode.set('register')"
            >
              สมัครสมาชิก
            </button>
          </div>

          @if (mode() === 'login') {
            <form class="member-form" (ngSubmit)="handleLogin()">
              <label for="loginEmail">อีเมล</label>
              <input id="loginEmail" name="loginEmail" type="email" [(ngModel)]="loginEmail" required />

              <label for="loginPassword">รหัสผ่าน</label>
              <input
                id="loginPassword"
                name="loginPassword"
                type="password"
                [(ngModel)]="loginPassword"
                required
              />

              <button class="primary-btn" type="submit">เข้าสู่ระบบ</button>
            </form>
          } @else {
            <form class="member-form" (ngSubmit)="handleRegister()">
              <label for="registerName">ชื่อผู้ใช้</label>
              <input
                id="registerName"
                name="registerName"
                type="text"
                [(ngModel)]="registerName"
                required
              />

              <label for="registerEmail">อีเมล</label>
              <input
                id="registerEmail"
                name="registerEmail"
                type="email"
                [(ngModel)]="registerEmail"
                required
              />

              <label for="registerPassword">รหัสผ่าน</label>
              <input
                id="registerPassword"
                name="registerPassword"
                type="password"
                [(ngModel)]="registerPassword"
                required
                minlength="6"
              />

              <button class="primary-btn" type="submit">สมัครสมาชิก</button>
            </form>
          }
        }
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .member-page {
        min-height: calc(100vh - 7rem);
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
      }

      .member-card {
        width: min(100%, 520px);
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
      }

      h1 {
        margin: 0 0 1rem;
        font-size: 1.6rem;
        color: #0f172a;
      }

      .profile-box h2 {
        margin: 0 0 0.5rem;
      }

      .profile-box p {
        margin: 0.35rem 0;
        color: #334155;
      }

      .mode-switch {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .mode-btn {
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 10px;
        padding: 0.6rem 0.9rem;
        cursor: pointer;
      }

      .mode-active {
        border-color: #2563eb;
        background: #eff6ff;
        color: #1d4ed8;
        font-weight: 700;
      }

      .member-form {
        display: grid;
        gap: 0.5rem;
      }

      label {
        font-size: 0.9rem;
        color: #475569;
        margin-top: 0.4rem;
      }

      input {
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.6rem 0.75rem;
        font-size: 0.95rem;
      }

      .actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }

      .primary-btn,
      .outline-btn {
        margin-top: 0.9rem;
        border-radius: 10px;
        padding: 0.65rem 1rem;
        border: 1px solid #1e293b;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.95rem;
      }

      .primary-btn {
        background: #1e293b;
        color: #fff;
      }

      .outline-btn {
        background: #fff;
        color: #0f172a;
      }
    `,
  ],
})
export default class MemberPage {
  mode = signal<'login' | 'register'>('login');

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  currentMember = currentMember;
  isLoggedIn = isLoggedIn;

  async handleLogin() {
    const result = await loginMember({
      email: this.loginEmail,
      password: this.loginPassword,
    });

    alert(result.message);

    if (result.ok) {
      this.loginPassword = '';
    }
  }

  async handleRegister() {
    const result = await registerMember({
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword,
    });

    alert(result.message);

    if (result.ok) {
      this.registerPassword = '';
      this.registerName = '';
      this.registerEmail = '';
    }
  }

  handleLogout() {
    logoutMember();
    this.mode.set('login');
  }
}
