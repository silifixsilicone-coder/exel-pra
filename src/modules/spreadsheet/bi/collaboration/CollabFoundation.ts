export interface CollabUser {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string; // User-specific cursor color
  activeCell: string; // Currently selected cell e.g. "A1"
}

export interface CollabComment {
  id: string;
  cellKey: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface VersionChange {
  id: string;
  timestamp: number;
  userName: string;
  description: string;
  snapshot: any; // WorkbookState copy
}

export interface UserPermission {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
}

export class CollabManager {
  private users: CollabUser[] = [];
  private comments: CollabComment[] = [];
  private versions: VersionChange[] = [];
  private permissions: UserPermission[] = [];

  constructor() {
    // Inject mock indicators for local visual preview
    this.users = [
      { id: 'user-1', name: 'Alice Smith', color: '#10b981', activeCell: 'C3' },
      { id: 'user-2', name: 'Bob Johnson', color: '#3b82f6', activeCell: 'E4' }
    ];

    this.comments = [
      { id: 'c-1', cellKey: 'B2', userName: 'Alice Smith', text: 'Please verify the unit price matches tax invoice.', timestamp: Date.now() }
    ];
  }

  // Live Presence API
  public getActiveUsers(): CollabUser[] {
    return this.users;
  }

  public updateUserPosition(userId: string, cellKey: string) {
    this.users = this.users.map(u => u.id === userId ? { ...u, activeCell: cellKey } : u);
  }

  // Comment Threading API
  public getComments(cellKey: string): CollabComment[] {
    return this.comments.filter(c => c.cellKey === cellKey);
  }

  public addComment(cellKey: string, userName: string, text: string) {
    const comment: CollabComment = {
      id: `comment-${Date.now()}`,
      cellKey,
      userName,
      text,
      timestamp: Date.now()
    };
    this.comments.push(comment);
  }

  // Version Control API
  public createVersion(userName: string, description: string, snapshot: any) {
    const version: VersionChange = {
      id: `v-${Date.now()}`,
      timestamp: Date.now(),
      userName,
      description,
      snapshot
    };
    this.versions.push(version);
  }

  public getVersions(): VersionChange[] {
    return this.versions;
  }

  // Permissions API
  public getPermission(userId: string): 'owner' | 'editor' | 'viewer' {
    const record = this.permissions.find(p => p.userId === userId);
    return record ? record.role : 'editor';
  }
}
