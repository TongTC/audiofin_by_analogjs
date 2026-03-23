import { computed, signal } from '@angular/core';

const MEMBER_USERS_KEY = 'analogjs_member_users';
const MEMBER_SESSION_KEY = 'analogjs_member_session';

interface MemberRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: MemberRole;
  createdAt: string;
}

type MemberRole = 'admin' | 'user';

interface RawMemberRecord {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  passwordHash?: string;
  role?: MemberRole;
  createdAt?: string;
}

export interface MemberProfile {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  createdAt: string;
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toProfile(user: MemberRecord): MemberProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function simpleHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }

  return (hash >>> 0).toString(16);
}

async function hashPassword(password: string): Promise<string> {
  const hasWebCrypto = typeof globalThis !== 'undefined' && !!globalThis.crypto?.subtle;
  if (hasWebCrypto) {
    const encoded = new TextEncoder().encode(password);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return `sha256:${toHex(digest)}`;
  }

  // Fallback for environments without SubtleCrypto.
  return `fallback:${simpleHash(password)}`;
}

function loadUsers(): MemberRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MEMBER_USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as RawMemberRecord[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => {
        return (
          typeof item?.id === 'number' &&
          typeof item?.name === 'string' &&
          typeof item?.email === 'string' &&
          typeof item?.createdAt === 'string' &&
          (typeof item?.passwordHash === 'string' || typeof item?.password === 'string')
        );
      })
      .map((item, index) => {
        const passwordHash =
          typeof item.passwordHash === 'string'
            ? item.passwordHash
            : `legacy:${item.password ?? ''}`;

        return {
          id: item.id ?? index + 1,
          name: item.name ?? 'Member',
          email: normalizeEmail(item.email ?? ''),
          passwordHash,
          role: item.role === 'admin' ? 'admin' : 'user',
          createdAt: item.createdAt ?? new Date().toISOString(),
        } satisfies MemberRecord;
      });
  } catch {
    return [];
  }
}

function saveUsers(users: MemberRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(MEMBER_USERS_KEY, JSON.stringify(users));
}

function loadSession(users: MemberRecord[]): MemberProfile | null {
  if (!canUseStorage()) {
    return null;
  }

  const email = window.localStorage.getItem(MEMBER_SESSION_KEY);
  if (!email) {
    return null;
  }

  const found = users.find((item) => item.email === email);
  return found ? toProfile(found) : null;
}

function saveSession(email: string | null) {
  if (!canUseStorage()) {
    return;
  }

  if (!email) {
    window.localStorage.removeItem(MEMBER_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(MEMBER_SESSION_KEY, email);
}

const initialUsers = loadUsers();

export const memberUsers = signal<MemberRecord[]>(initialUsers);
export const currentMember = signal<MemberProfile | null>(loadSession(initialUsers));
export const isLoggedIn = computed(() => currentMember() !== null);
export const memberRole = computed<MemberRole | null>(() => currentMember()?.role ?? null);
export const isAdmin = computed(() => memberRole() === 'admin');

function refreshCurrentMember(users: MemberRecord[]) {
  const sessionUser = currentMember();
  if (!sessionUser) {
    return;
  }

  const fresh = users.find((item) => item.email === sessionUser.email);
  if (!fresh) {
    currentMember.set(null);
    saveSession(null);
    return;
  }

  currentMember.set(toProfile(fresh));
}

function upsertUser(user: MemberRecord) {
  memberUsers.update((users) => {
    const updated = users.map((item) => (item.email === user.email ? user : item));
    saveUsers(updated);
    refreshCurrentMember(updated);
    return updated;
  });
}

export async function registerMember(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: boolean; message: string }> {
  const name = payload.name.trim();
  const email = normalizeEmail(payload.email);
  const password = payload.password;

  if (!name || !email || !password) {
    return { ok: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร' };
  }

  const exists = memberUsers().some((item) => item.email === email);
  if (exists) {
    return { ok: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
  }

  const passwordHash = await hashPassword(password);
  const role: MemberRole = memberUsers().length === 0 ? 'admin' : 'user';

  const user: MemberRecord = {
    id: Date.now(),
    name,
    email,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  memberUsers.update((users) => {
    const updated = [...users, user];
    saveUsers(updated);
    return updated;
  });

  currentMember.set(toProfile(user));
  saveSession(user.email);

  return {
    ok: true,
    message: role === 'admin' ? 'สมัครสมาชิกสำเร็จ (บัญชีแรกเป็นผู้ดูแลระบบ)' : 'สมัครสมาชิกสำเร็จ',
  };
}

export async function loginMember(payload: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; message: string }> {
  const email = normalizeEmail(payload.email);
  const password = payload.password;

  const found = memberUsers().find((item) => item.email === email);
  if (!found) {
    return { ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  }

  const hash = found.passwordHash;
  let isValid = false;

  if (hash.startsWith('legacy:')) {
    isValid = hash.replace('legacy:', '') === password;

    if (isValid) {
      const upgraded: MemberRecord = {
        ...found,
        passwordHash: await hashPassword(password),
      };
      upsertUser(upgraded);
    }
  } else {
    const incomingHash = await hashPassword(password);
    isValid = incomingHash === hash;
  }

  if (!isValid) {
    return { ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  }

  const latest = memberUsers().find((item) => item.email === email) ?? found;
  currentMember.set(toProfile(latest));
  saveSession(found.email);

  return { ok: true, message: 'เข้าสู่ระบบสำเร็จ' };
}

export function updateMemberName(name: string): { ok: boolean; message: string } {
  const active = currentMember();
  if (!active) {
    return { ok: false, message: 'กรุณาเข้าสู่ระบบก่อน' };
  }

  const nextName = name.trim();
  if (!nextName) {
    return { ok: false, message: 'กรุณาระบุชื่อผู้ใช้' };
  }

  const target = memberUsers().find((item) => item.email === active.email);
  if (!target) {
    return { ok: false, message: 'ไม่พบบัญชีผู้ใช้' };
  }

  upsertUser({ ...target, name: nextName });
  return { ok: true, message: 'อัปเดตชื่อสำเร็จ' };
}

export async function updateMemberPassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: boolean; message: string }> {
  const active = currentMember();
  if (!active) {
    return { ok: false, message: 'กรุณาเข้าสู่ระบบก่อน' };
  }

  if (payload.newPassword.length < 6) {
    return { ok: false, message: 'รหัสผ่านใหม่ต้องอย่างน้อย 6 ตัวอักษร' };
  }

  const target = memberUsers().find((item) => item.email === active.email);
  if (!target) {
    return { ok: false, message: 'ไม่พบบัญชีผู้ใช้' };
  }

  const loginCheck = await loginMember({
    email: active.email,
    password: payload.currentPassword,
  });

  if (!loginCheck.ok) {
    return { ok: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' };
  }

  const updated: MemberRecord = {
    ...target,
    passwordHash: await hashPassword(payload.newPassword),
  };
  upsertUser(updated);

  return { ok: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
}

export function logoutMember() {
  currentMember.set(null);
  saveSession(null);
}
