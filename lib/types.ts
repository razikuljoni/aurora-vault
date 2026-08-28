export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  currentUserRole: Role;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  joinedAt: string;
}

export type NoteStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface NoteVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  summary?: string;
  createdBy: string;
  createdAt: string;
}

export interface Note {
  id: string;
  workspaceId: string;
  title: string;
  slug: string;
  content: string;
  contentFormat: 'markdown' | 'tiptap';
  status: NoteStatus;
  tags: string[];
  collectionId?: string;
  collectionName?: string;
  createdBy: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  versionCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  backlinksCount?: number;
  pinned?: boolean;
}

export interface Backlink {
  id: string;
  sourceType: 'NOTE' | 'DOCUMENT' | 'BOOKMARK' | 'CODE';
  sourceId: string;
  sourceTitle: string;
  targetId: string;
  targetTitle: string;
  contextSnippet: string;
  createdAt: string;
}

export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface DocumentHighlight {
  id: string;
  documentId: string;
  page: number;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  noteId?: string;
  noteTitle?: string;
  color: 'amber' | 'emerald' | 'sky' | 'purple' | 'rose';
  comment?: string;
  createdBy: string;
  createdAt: string;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface DocumentItem {
  id: string;
  workspaceId: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  pageCount: number;
  extractedText: string;
  pages: DocumentPage[];
  highlights: DocumentHighlight[];
  tags: string[];
  collectionId?: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
}

export interface BookmarkMetadata {
  title: string;
  description: string;
  ogImage?: string;
  domain: string;
  author?: string;
  favicon?: string;
}

export interface Bookmark {
  id: string;
  workspaceId: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  ogImage?: string;
  favicon?: string;
  author?: string;
  tags: string[];
  collectionId?: string;
  collectionName?: string;
  readStatus: 'UNREAD' | 'READ';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CodeSnippet {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  language: string;
  code: string;
  repository?: string;
  filePath?: string;
  lineRange?: string;
  tags: string[];
  collectionId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentId?: string;
  itemsCount: {
    notes: number;
    documents: number;
    bookmarks: number;
    code: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type NodeType = 'NOTE' | 'DOCUMENT' | 'BOOKMARK' | 'CODE' | 'COLLECTION' | 'PROJECT' | 'CONCEPT';
export type EdgeType = 'REFERENCES' | 'TAGGED_WITH' | 'CONTAINS' | 'DERIVED_FROM' | 'RELATED_TO' | 'PART_OF' | 'CITES';

export interface KnowledgeNode {
  id: string;
  title: string;
  type: NodeType;
  tags: string[];
  size?: number;
  connectionsCount?: number;
  collectionName?: string;
  updatedAt: string;
  dataRefId?: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  weight?: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export type InboxItemType = 'NOTE' | 'URL' | 'TEXT' | 'CODE';

export interface InboxItem {
  id: string;
  workspaceId: string;
  type: InboxItemType;
  title: string;
  content: string;
  url?: string;
  language?: string;
  tags: string[];
  createdAt: string;
  status: 'PENDING' | 'TRIAGED' | 'ARCHIVED';
}

export interface ActivityItem {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'LINKED' | 'PROCESSED' | 'HIGHLIGHTED' | 'RESTORED';
  resourceType: 'NOTE' | 'DOCUMENT' | 'BOOKMARK' | 'CODE' | 'COLLECTION' | 'RELATIONSHIP';
  resourceId: string;
  resourceTitle: string;
  timestamp: string;
  details?: string;
}

export interface AuditLogItem {
  id: string;
  workspaceId: string;
  actorId: string;
  actorEmail: string;
  actorRole: Role;
  eventType: 'MEMBER_INVITED' | 'ROLE_CHANGED' | 'PERMISSION_REVOKED' | 'RESOURCE_PURGED' | 'AUTH_LOGIN' | 'API_KEY_ROTATED' | 'SECURITY_SCAN' | 'WORKSPACE_SETTINGS_UPDATED';
  targetResource: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FAILED';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SavedSearch {
  id: string;
  workspaceId: string;
  name: string;
  query: string;
  filters: {
    types?: NodeType[];
    tags?: string[];
    collections?: string[];
  };
  createdAt: string;
}

export interface DeterministicIntelligenceInsights {
  staleNotes: { id: string; title: string; daysInactive: number; tags: string[] }[];
  orphanNodes: { id: string; title: string; type: NodeType }[];
  unreferencedSources: { id: string; title: string; type: 'DOCUMENT' | 'BOOKMARK' }[];
  highImpactHubs: { id: string; title: string; connectionCount: number; type: NodeType }[];
  potentialDuplicates: { idA: string; titleA: string; idB: string; titleB: string; similarityReason: string }[];
  knowledgePulse: {
    totalItems: number;
    newThisWeek: number;
    connectedRatio: number;
    activeCollections: number;
  };
}
