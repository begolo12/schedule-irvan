/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  assigneeId: string;
  assigneeName: string;
  assigneeAvatarColor: string;
  tags: string[];
  isEncrypted: boolean;
  division?: string; // e.g. 'Divisi Operasi', 'Divisi Finansial', 'Divisi IT Backend'
  originalTitle?: string; // Cache for display when decrypted
  originalDescription?: string; // Cache for display when decrypted
}

export interface RealtimeEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  taskTitle: string;
  timestamp: string;
}

export interface WebNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'collaboration' | 'sync' | 'system';
}

export interface DeveloperApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

export interface SyncDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  isOnline: boolean;
  lastSync: string;
}
