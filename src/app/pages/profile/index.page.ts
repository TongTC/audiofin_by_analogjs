import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  currentMember,
  isLoggedIn,
  updateMemberName,
  updateMemberPassword,
} from '../../auth.store';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="profile-page">
      <section class="profile-card">
        <h1>โปรไฟล์สมาชิก</h1>

        @if (!isLoggedIn()) {
          <p class="hint">กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้</p>
          <a routerLink="/member" class="btn-primary">ไปหน้าเข้าสู่ระบบ</a>
        } @else {
          <p class="hint">อีเมล: {{ currentMember()?.email }}</p>
          <p class="hint">บทบาท: {{ currentMember()?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก' }}</p>

          <form class="form" (ngSubmit)="saveName()">
            <h2>แก้ไขชื่อผู้ใช้</h2>
            <label for="profileName">ชื่อผู้ใช้</label>
            <input id="profileName" name="profileName" type="text" [(ngModel)]="profileName" required />
            <button type="submit" class="btn-primary">บันทึกชื่อ</button>
          </form>

          <form class="form" (ngSubmit)="changePassword()">
            <h2>เปลี่ยนรหัสผ่าน</h2>
            <label for="currentPassword">รหัสผ่านเดิม</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              [(ngModel)]="currentPassword"
              required
            />

            <label for="newPassword">รหัสผ่านใหม่</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              [(ngModel)]="newPassword"
              minlength="6"
              required
            />

            <button type="submit" class="btn-primary">เปลี่ยนรหัสผ่าน</button>
          </form>
        }
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .profile-page {
        min-height: calc(100vh - 7rem);
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
      }

      .profile-card {
        width: min(100%, 560px);
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
      }

      h1 {
        margin: 0 0 1rem;
        font-size: 1.6rem;
      }

      h2 {
        margin: 0;
        font-size: 1.05rem;
      }

      .hint {
        margin: 0.25rem 0;
        color: #475569;
      }

      .form {
        margin-top: 1rem;
        display: grid;
        gap: 0.45rem;
        border-top: 1px solid #e2e8f0;
        padding-top: 1rem;
      }

      input {
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.6rem 0.75rem;
      }

      .btn-primary {
        margin-top: 0.5rem;
        border-radius: 10px;
        border: 1px solid #1e293b;
        background: #1e293b;
        color: #fff;
        padding: 0.6rem 0.95rem;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
      }
    `,
  ],
})
export default class ProfilePage {
  currentMember = currentMember;
  isLoggedIn = isLoggedIn;

  profileName = currentMember()?.name ?? '';
  currentPassword = '';
  newPassword = '';

  constructor(private router: Router) {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/member');
      return;
    }

    this.profileName = this.currentMember()?.name ?? '';
  }

  saveName() {
    const result = updateMemberName(this.profileName);
    alert(result.message);
    if (result.ok) {
      this.profileName = this.currentMember()?.name ?? '';
    }
  }

  async changePassword() {
    const result = await updateMemberPassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });

    alert(result.message);

    if (result.ok) {
      this.currentPassword = '';
      this.newPassword = '';
    }
  }
}
