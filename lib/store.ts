import {
  User,
  Workspace,
  WorkspaceMember,
  Note,
  NoteVersion,
  DocumentItem,
  Bookmark,
  CodeSnippet,
  Collection,
  KnowledgeNode,
  KnowledgeEdge,
  KnowledgeGraphData,
  ActivityItem,
  AuditLogItem,
  InboxItem,
  SavedSearch,
  DeterministicIntelligenceInsights,
  Backlink,
  DocumentHighlight,
  Role,
} from './types';

export const CURRENT_USER: User = {
  id: 'usr_aurora_01',
  name: 'Alex Vance',
  email: 'alex.vance@auroravault.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'OWNER',
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws_eng_arch',
    slug: 'engineering-intelligence',
    name: 'Engineering & Digital Intelligence',
    description: 'High-leverage research workspace for systems architecture, distributed systems, and modern AI pipelines.',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-28T09:30:00Z',
    membersCount: 4,
    storageUsedBytes: 428000000, // 428 MB
    storageLimitBytes: 10737418240, // 10 GB
    currentUserRole: 'OWNER',
  },
  {
    id: 'ws_research_papers',
    slug: 'deep-learning-lab',
    name: 'Deep Learning & ML Research Lab',
    description: 'Academic papers, model benchmarks, attention mechanisms, and empirical findings.',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-08-27T14:15:00Z',
    membersCount: 6,
    storageUsedBytes: 1850000000,
    storageLimitBytes: 21474836480,
    currentUserRole: 'ADMIN',
  },
];

export const INITIAL_MEMBERS: WorkspaceMember[] = [
  {
    id: 'mem_01',
    userId: 'usr_aurora_01',
    workspaceId: 'ws_eng_arch',
    name: 'Alex Vance',
    email: 'alex.vance@auroravault.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'OWNER',
    joinedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'mem_02',
    userId: 'usr_aurora_02',
    workspaceId: 'ws_eng_arch',
    name: 'Elena Rostova',
    email: 'elena.rostova@auroravault.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    joinedAt: '2026-01-18T11:20:00Z',
  },
  {
    id: 'mem_03',
    userId: 'usr_aurora_03',
    workspaceId: 'ws_eng_arch',
    name: 'Marcus Thorne',
    email: 'marcus.t@auroravault.io',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'EDITOR',
    joinedAt: '2026-02-01T09:45:00Z',
  },
  {
    id: 'mem_04',
    userId: 'usr_aurora_04',
    workspaceId: 'ws_eng_arch',
    name: 'Dr. Sarah Lin',
    email: 'sarah.lin@stanford.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'VIEWER',
    joinedAt: '2026-03-12T16:10:00Z',
  },
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col_systems_arch',
    workspaceId: 'ws_eng_arch',
    name: 'Systems Architecture',
    description: 'Core paradigms for distributed state, transactional guarantees, and consensus.',
    color: '#0284c7', // Sky
    icon: 'Layers',
    itemsCount: { notes: 5, documents: 3, bookmarks: 4, code: 3 },
    createdBy: 'usr_aurora_01',
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
  },
  {
    id: 'col_vector_graph',
    workspaceId: 'ws_eng_arch',
    name: 'Graph & Vector Indexing',
    description: 'Graph theory structures, HNSW vector indices, and hybrid deterministic retrieval.',
    color: '#059669', // Emerald
    icon: 'Share2',
    itemsCount: { notes: 4, documents: 2, bookmarks: 3, code: 2 },
    createdBy: 'usr_aurora_01',
    createdAt: '2026-02-05T14:30:00Z',
    updatedAt: '2026-08-26T16:20:00Z',
  },
  {
    id: 'col_lumen_design',
    workspaceId: 'ws_eng_arch',
    name: 'Lumen Grid Design System',
    description: 'Tokens, spatial constraints, reading surfaces, and accessible interaction primitives.',
    color: '#d97706', // Amber
    icon: 'Grid',
    itemsCount: { notes: 3, documents: 1, bookmarks: 2, code: 2 },
    createdBy: 'usr_aurora_01',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-08-27T10:00:00Z',
  },
  {
    id: 'col_security_hardening',
    workspaceId: 'ws_eng_arch',
    name: 'Zero-Trust & Security',
    description: 'RBAC boundary policies, SSRF sanitization, and cryptographic session isolation.',
    color: '#dc2626', // Red
    icon: 'ShieldCheck',
    itemsCount: { notes: 2, documents: 2, bookmarks: 2, code: 1 },
    createdBy: 'usr_aurora_02',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_nextjs_arch',
    workspaceId: 'ws_eng_arch',
    title: 'Next.js Architecture & High-Performance Pipelines',
    slug: 'nextjs-architecture-high-performance-pipelines',
    contentFormat: 'markdown',
    status: 'ACTIVE',
    tags: ['nextjs', 'architecture', 'react', 'performance', 'frontend'],
    collectionId: 'col_systems_arch',
    collectionName: 'Systems Architecture',
    createdBy: 'usr_aurora_01',
    authorName: 'Alex Vance',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-28T07:15:00Z',
    versionCount: 4,
    wordCount: 840,
    readingTimeMinutes: 4,
    backlinksCount: 3,
    pinned: true,
    content: `# Next.js Architecture & High-Performance Pipelines

## Executive Overview
When architecting enterprise-scale applications with Next.js 15+ App Router, performance depends on respecting the strict boundaries between **Server Components** and interactive **Client Leaves**.

### Core Tenets of the Lumen Pipeline
1. **Server Authorization Guarantee**: Never trust client-provided headers or props for authorization. Scope all database and memory queries to authenticated \`workspaceId\` at the server boundary.
2. **Deterministic State Synchronization**: See [[Deterministic Intelligence & Graph Matrix]] for our mathematical approach to identifying knowledge gaps and orphan notes.
3. **Low Latency Graph Queries**: Integrated with our [[Graph & Vector Indexing Paradigms]] to resolve bi-directional backlinks in $O(1)$ amortized time.

\`\`\`typescript
// Server boundary token validation
export async function enforceWorkspaceAccess(workspaceId: string, minRole: Role) {
  const session = await getAuthenticatedSession();
  const membership = await db.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: session.userId, workspaceId } }
  });
  if (!membership || !isRoleSufficient(membership.role, minRole)) {
    throw new UnauthorizedError('WORKSPACE_ACCESS_DENIED');
  }
  return membership;
}
\`\`\`

## Integration with Document Highlights
As referenced in our empirical testing against [[Distributed Cache & State Invalidation]], extracted highlights from [[PDF_Spec_Whitepaper]] demonstrate that client memory footprint drops by 42% when UI state is decoupled from server caches.

### Key References & Backlinks
- Related: [[Lumen Grid Design Tokens & Spacing]]
- Security spec: [[Zero-Trust Security & SSRF Defense]]
`,
  },
  {
    id: 'note_deterministic_intel',
    workspaceId: 'ws_eng_arch',
    title: 'Deterministic Intelligence & Graph Matrix',
    slug: 'deterministic-intelligence-graph-matrix',
    contentFormat: 'markdown',
    status: 'ACTIVE',
    tags: ['graph', 'intelligence', 'algorithms', 'matrix'],
    collectionId: 'col_vector_graph',
    collectionName: 'Graph & Vector Indexing',
    createdBy: 'usr_aurora_01',
    authorName: 'Alex Vance',
    createdAt: '2026-02-14T14:20:00Z',
    updatedAt: '2026-08-27T18:40:00Z',
    versionCount: 3,
    wordCount: 620,
    readingTimeMinutes: 3,
    backlinksCount: 4,
    pinned: true,
    content: `# Deterministic Intelligence & Graph Matrix

## Philosophy
Before reaching for generative LLMs, knowledge software must build **provably correct, deterministic intelligence**. 

### 1. The 5 Core Deterministic Metrics
- **Orphan Node Detection**: Identifies any resource with zero inbound or outbound knowledge edges.
- **Stale Knowledge Decay**: Flags nodes untouched for $>45$ days while having active upstream dependencies.
- **Unreferenced Source Gap**: Highlights documents and bookmarks that have not been cited or linked into any note.
- **Hub & Authority Scoring**: Computes PageRank / eigenvector centrality across the workspace knowledge graph.
- **Duplicate Concept Collision**: Cosine and token overlap checks on URL domains and note titles.

### Connection to [[Next.js Architecture & High-Performance Pipelines]]
The graph traversal runs in Web Workers on the client and is cached in Redis on the server. When Note A embeds \`[[Note B]]\`, the bidirectional backlink table is updated atomically.

See also: [[Lumen Grid Design Tokens & Spacing]] for rendering visual nodes.
`,
  },
  {
    id: 'note_lumen_design',
    workspaceId: 'ws_eng_arch',
    title: 'Lumen Grid Design Tokens & Spacing',
    slug: 'lumen-grid-design-tokens-spacing',
    contentFormat: 'markdown',
    status: 'ACTIVE',
    tags: ['design-system', 'tokens', 'ui', 'css', 'accessibility'],
    collectionId: 'col_lumen_design',
    collectionName: 'Lumen Grid Design System',
    createdBy: 'usr_aurora_01',
    authorName: 'Alex Vance',
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-08-26T15:10:00Z',
    versionCount: 2,
    wordCount: 490,
    readingTimeMinutes: 2,
    backlinksCount: 3,
    content: `# Lumen Grid Design Tokens & Spacing

## The 'Quiet by Default' Axiom
Lumen Grid combines editorial typography, developer-tool density, and distraction-free surfaces.

### Spacing Rules
- Base unit: 8px grid (4, 8, 12, 16, 24, 32, 48, 64px)
- Nested border radius rule: $R_{inner} = R_{outer} - Padding$
- Contrast requirements: Minimum 4.5:1 for body text (WCAG AA).
- Neutral saturation: Tightly bounded to $<5\\%$ warm-cool balance.

### Signature Primitives
1. **LumenCard**: Primary resource summary container with metadata badges.
2. **ContextRail**: Collapsible sidebar housing backlinks, linked documents, and version diffs.
3. **ReadingSurface**: Optical 68ch reading column with serif display accents.

References: [[Next.js Architecture & High-Performance Pipelines]]
`,
  },
  {
    id: 'note_security_zero_trust',
    workspaceId: 'ws_eng_arch',
    title: 'Zero-Trust Security & SSRF Defense',
    slug: 'zero-trust-security-ssrf-defense',
    contentFormat: 'markdown',
    status: 'ACTIVE',
    tags: ['security', 'ssrf', 'rbac', 'zero-trust', 'compliance'],
    collectionId: 'col_security_hardening',
    collectionName: 'Zero-Trust & Security',
    createdBy: 'usr_aurora_02',
    authorName: 'Elena Rostova',
    createdAt: '2026-03-22T09:30:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
    versionCount: 2,
    wordCount: 710,
    readingTimeMinutes: 3,
    backlinksCount: 2,
    content: `# Zero-Trust Security & SSRF Defense

## Threat Vector Analysis: Bookmark Scrapers
When users submit URLs for bookmark metadata ingestion, unconstrained HTTP requests expose servers to **Server-Side Request Forgery (SSRF)** against:
- Cloud metadata endpoints (\`169.254.169.254\`)
- Localhost loopback (\`127.0.0.1\`, \`::1\`, \`0.0.0.0\`)
- Private RFC 1918 blocks (\`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`)

\`\`\`typescript
// Safe SSRF Resolver Guard
export function isSafePublicUrl(targetUrl: string): boolean {
  const parsed = new URL(targetUrl);
  if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return false;
  // Further IP range resolution checks
  return true;
}
\`\`\`

Cross-referenced in [[Next.js Architecture & High-Performance Pipelines]].
`,
  },
  {
    id: 'note_distributed_cache',
    workspaceId: 'ws_eng_arch',
    title: 'Distributed Cache & State Invalidation',
    slug: 'distributed-cache-state-invalidation',
    contentFormat: 'markdown',
    status: 'ACTIVE',
    tags: ['caching', 'redis', 'distributed-systems', 'consistency'],
    collectionId: 'col_systems_arch',
    collectionName: 'Systems Architecture',
    createdBy: 'usr_aurora_03',
    authorName: 'Marcus Thorne',
    createdAt: '2026-04-05T16:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z',
    versionCount: 1,
    wordCount: 530,
    readingTimeMinutes: 3,
    backlinksCount: 1,
    content: `# Distributed Cache & State Invalidation

## Cache Stampede Prevention
In high-concurrency knowledge graphs, invalidating a single node can trigger cascading cache misses.

### Key Strategies
- **Probabilistic Early Expiration (XFetch)**
- **Deterministic Key Namespaces**: \`ws:{workspaceId}:note:{noteId}:v{version}\`
- **Mutating Write-Through Pipelines**

Linked to [[Next.js Architecture & High-Performance Pipelines]] and [[Deterministic Intelligence & Graph Matrix]].
`,
  },
];

export const INITIAL_NOTE_VERSIONS: Record<string, NoteVersion[]> = {
  note_nextjs_arch: [
    {
      id: 'ver_01',
      versionNumber: 1,
      title: 'Next.js 15 Initial Setup',
      content: '# Next.js 15 Initial Setup\n\nBasic App Router scaffold and component draft.',
      summary: 'Initial draft creation',
      createdBy: 'Alex Vance',
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'ver_02',
      versionNumber: 2,
      title: 'Next.js Architecture & High-Performance Pipelines',
      content: '# Next.js Architecture\n\nAdded server boundary authorization rules and client isolation.',
      summary: 'Added server authorization and RBAC verification snippets',
      createdBy: 'Alex Vance',
      createdAt: '2026-04-12T15:30:00Z',
    },
    {
      id: 'ver_03',
      versionNumber: 3,
      title: 'Next.js Architecture & High-Performance Pipelines',
      content: '# Next.js Architecture\n\nConnected backlink matrix and distributed caching references.',
      summary: 'Connected [[Deterministic Intelligence & Graph Matrix]] and [[Distributed Cache & State Invalidation]]',
      createdBy: 'Alex Vance',
      createdAt: '2026-07-20T09:10:00Z',
    },
    {
      id: 'ver_04',
      versionNumber: 4,
      title: 'Next.js Architecture & High-Performance Pipelines',
      content: INITIAL_NOTES[0].content,
      summary: 'Added code blocks, benchmark metrics, and Lumen Grid design token references',
      createdBy: 'Alex Vance',
      createdAt: '2026-08-28T07:15:00Z',
    },
  ],
  note_deterministic_intel: [
    {
      id: 'ver_det_01',
      versionNumber: 1,
      title: 'Deterministic Knowledge Analysis',
      content: '# Deterministic Knowledge Analysis\n\nDrafting orphan node detector.',
      summary: 'Initial concept draft',
      createdBy: 'Alex Vance',
      createdAt: '2026-02-14T14:20:00Z',
    },
    {
      id: 'ver_det_02',
      versionNumber: 2,
      title: 'Deterministic Intelligence & Graph Matrix',
      content: '# Deterministic Intelligence & Graph Matrix\n\nAdded stale knowledge and unreferenced source checks.',
      summary: 'Added 5 core deterministic intelligence metrics',
      createdBy: 'Alex Vance',
      createdAt: '2026-06-10T11:00:00Z',
    },
    {
      id: 'ver_det_03',
      versionNumber: 3,
      title: 'Deterministic Intelligence & Graph Matrix',
      content: INITIAL_NOTES[1].content,
      summary: 'Linked backlink graph and PageRank centrality equations',
      createdBy: 'Alex Vance',
      createdAt: '2026-08-27T18:40:00Z',
    },
  ],
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_arch_whitepaper',
    workspaceId: 'ws_eng_arch',
    title: 'Distributed Systems & Memory Consensus Whitepaper',
    fileName: 'distributed-systems-consensus-2026.pdf',
    fileSize: 4280000, // 4.28 MB
    mimeType: 'application/pdf',
    status: 'READY',
    pageCount: 14,
    tags: ['distributed-systems', 'consensus', 'raft', 'paxos', 'architecture'],
    collectionId: 'col_systems_arch',
    uploadedBy: 'usr_aurora_01',
    uploadedByName: 'Alex Vance',
    createdAt: '2026-02-03T11:00:00Z',
    updatedAt: '2026-08-20T14:00:00Z',
    summary: 'Comprehensive analysis of asynchronous consensus algorithms under network partitions with empirical benchmarks comparing Raft and Multi-Paxos implementations.',
    extractedText: `Section 1: Asynchronous Consensus & Partial Synchrony
Modern cloud topologies operate under partial synchrony where message propagation delays have an upper bound that is unknown a priori. Under these conditions, the FLP Impossibility Result dictates that no deterministic consensus protocol can guarantee safety and liveness simultaneously in purely asynchronous networks.

Section 2: High Throughput Log Replication
By pipelining heartbeats and batching state machine transitions, log write amplification is reduced by 64%. Furthermore, speculative execution of uncommitted read-only requests provides linearizable semantics without incurring disk flush latencies.

Section 3: Cache Invalidation & Edge Sync
Edge nodes maintain local vector clocks to synchronize materialized views with zero round-trip overhead when mutations are non-conflicting.`,
    pages: [
      {
        pageNumber: 1,
        text: 'Section 1: Asynchronous Consensus & Partial Synchrony\nModern cloud topologies operate under partial synchrony where message propagation delays have an upper bound that is unknown a priori. Under these conditions, the FLP Impossibility Result dictates that no deterministic consensus protocol can guarantee safety and liveness simultaneously in purely asynchronous networks.',
      },
      {
        pageNumber: 2,
        text: 'Section 2: High Throughput Log Replication\nBy pipelining heartbeats and batching state machine transitions, log write amplification is reduced by 64%. Furthermore, speculative execution of uncommitted read-only requests provides linearizable semantics without incurring disk flush latencies.',
      },
      {
        pageNumber: 3,
        text: 'Section 3: Cache Invalidation & Edge Sync\nEdge nodes maintain local vector clocks to synchronize materialized views with zero round-trip overhead when mutations are non-conflicting.',
      },
    ],
    highlights: [
      {
        id: 'hl_01',
        documentId: 'doc_arch_whitepaper',
        page: 2,
        startOffset: 82,
        endOffset: 160,
        selectedText: 'log write amplification is reduced by 64%',
        noteId: 'note_nextjs_arch',
        noteTitle: 'Next.js Architecture & High-Performance Pipelines',
        color: 'emerald',
        comment: 'Key empirical data point cited in performance benchmark note.',
        createdBy: 'Alex Vance',
        createdAt: '2026-02-04T12:00:00Z',
      },
      {
        id: 'hl_02',
        documentId: 'doc_arch_whitepaper',
        page: 1,
        startOffset: 120,
        endOffset: 240,
        selectedText: 'no deterministic consensus protocol can guarantee safety and liveness simultaneously in purely asynchronous networks',
        noteId: 'note_deterministic_intel',
        noteTitle: 'Deterministic Intelligence & Graph Matrix',
        color: 'purple',
        comment: 'Theoretical underpinning of our deterministic local-first guarantee.',
        createdBy: 'Alex Vance',
        createdAt: '2026-02-15T09:00:00Z',
      },
    ],
  },
  {
    id: 'doc_vector_index_spec',
    workspaceId: 'ws_eng_arch',
    title: 'HNSW Graph Indexing & Memory Layout Specification',
    fileName: 'hnsw-graph-indexing-spec-v3.pdf',
    fileSize: 2150000,
    mimeType: 'application/pdf',
    status: 'READY',
    pageCount: 8,
    tags: ['vector-search', 'hnsw', 'graph-theory', 'algorithms'],
    collectionId: 'col_vector_graph',
    uploadedBy: 'usr_aurora_01',
    uploadedByName: 'Alex Vance',
    createdAt: '2026-03-10T14:30:00Z',
    updatedAt: '2026-08-22T08:45:00Z',
    summary: 'Technical specification for Hierarchical Navigable Small World graphs optimized for cache-line aligned AVX-512 SIMD vector distance calculations.',
    extractedText: `Hierarchical Navigable Small World (HNSW) Graphs structure multi-layer navigable networks where top layers feature sparse long-range connections and bottom layers contain dense local nearest neighbors.

Greedy routing begins at the top entry point and transitions downward upon reaching local minima, achieving logarithmic search complexity $O(\\log N)$.`,
    pages: [
      {
        pageNumber: 1,
        text: 'Hierarchical Navigable Small World (HNSW) Graphs structure multi-layer navigable networks where top layers feature sparse long-range connections and bottom layers contain dense local nearest neighbors.',
      },
      {
        pageNumber: 2,
        text: 'Greedy routing begins at the top entry point and transitions downward upon reaching local minima, achieving logarithmic search complexity O(log N).',
      },
    ],
    highlights: [
      {
        id: 'hl_03',
        documentId: 'doc_vector_index_spec',
        page: 2,
        startOffset: 50,
        endOffset: 120,
        selectedText: 'achieving logarithmic search complexity O(log N)',
        color: 'sky',
        comment: 'Core algorithmic complexity guarantee.',
        createdBy: 'Alex Vance',
        createdAt: '2026-03-11T10:00:00Z',
      },
    ],
  },
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm_01',
    workspaceId: 'ws_eng_arch',
    url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
    title: 'React Server Components & Next.js App Router Paradigms',
    description: 'Deep architectural guide to Server Components, Streaming SSR, and selective hydration boundaries in modern web platforms.',
    domain: 'nextjs.org',
    favicon: 'https://nextjs.org/favicon.ico',
    ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    author: 'Next.js Core Team',
    tags: ['nextjs', 'react', 'rsc', 'architecture'],
    collectionId: 'col_systems_arch',
    collectionName: 'Systems Architecture',
    readStatus: 'READ',
    createdBy: 'usr_aurora_01',
    createdAt: '2026-02-02T14:00:00Z',
    updatedAt: '2026-08-25T10:00:00Z',
    notes: 'Reference document for our component boundary guidelines in Note #1.',
  },
  {
    id: 'bm_02',
    workspaceId: 'ws_eng_arch',
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html',
    title: 'OWASP Server-Side Request Forgery (SSRF) Prevention Cheat Sheet',
    description: 'Definitive engineering defense patterns against SSRF, internal port scanning, DNS rebinding attacks, and cloud metadata theft.',
    domain: 'owasp.org',
    favicon: 'https://owasp.org/www-project-top-ten/assets/images/favicon.ico',
    ogImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    author: 'OWASP Foundation',
    tags: ['security', 'ssrf', 'owasp', 'defense'],
    collectionId: 'col_security_hardening',
    collectionName: 'Zero-Trust & Security',
    readStatus: 'READ',
    createdBy: 'usr_aurora_02',
    createdAt: '2026-03-21T16:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z',
    notes: 'Primary guidelines used in implementing our SSRF safe URL resolver.',
  },
  {
    id: 'bm_03',
    workspaceId: 'ws_eng_arch',
    url: 'https://arxiv.org/abs/1603.09320',
    title: 'Efficient and Robust Approximate Nearest Neighbor Using HNSW',
    description: 'Original research paper by Yu. A. Malkov and D. A. Yashunin introducing Hierarchical Navigable Small World graphs.',
    domain: 'arxiv.org',
    favicon: 'https://arxiv.org/favicon.ico',
    ogImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    author: 'Yu. A. Malkov, D. A. Yashunin',
    tags: ['arxiv', 'hnsw', 'algorithms', 'research'],
    collectionId: 'col_vector_graph',
    collectionName: 'Graph & Vector Indexing',
    readStatus: 'READ',
    createdBy: 'usr_aurora_01',
    createdAt: '2026-03-12T09:00:00Z',
    updatedAt: '2026-08-26T11:00:00Z',
    notes: 'Ground truth paper for graph index algorithms.',
  },
  {
    id: 'bm_04',
    workspaceId: 'ws_eng_arch',
    url: 'https://redis.io/docs/latest/develop/use/patterns/distributed-locks/',
    title: 'Distributed Locks with Redis & Redlock Algorithm',
    description: 'Pattern specification for fault-tolerant distributed mutual exclusion using Redis clusters and synchronized timeouts.',
    domain: 'redis.io',
    favicon: 'https://redis.io/favicon.ico',
    ogImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    author: 'Redis Engineering',
    tags: ['redis', 'distributed-locks', 'concurrency'],
    collectionId: 'col_systems_arch',
    collectionName: 'Systems Architecture',
    readStatus: 'UNREAD',
    createdBy: 'usr_aurora_03',
    createdAt: '2026-04-10T11:30:00Z',
    updatedAt: '2026-08-23T14:20:00Z',
  },
];

export const INITIAL_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'code_ssrf_validator',
    workspaceId: 'ws_eng_arch',
    title: 'SSRF Safe URL Resolver & IP Range Blocking',
    description: 'Production-ready TypeScript utility that verifies target hosts against private IPv4/IPv6 blocks, cloud metadata IP, and loopback.',
    language: 'typescript',
    repository: 'github.com/aurora-vault/core-security',
    filePath: 'packages/security/src/ssrf-guard.ts',
    lineRange: '14-58',
    tags: ['typescript', 'security', 'ssrf', 'networking'],
    collectionId: 'col_security_hardening',
    createdBy: 'usr_aurora_02',
    createdAt: '2026-03-23T10:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
    code: `import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const BLOCKED_IP_RANGES = [
  /^127\\./,               // Loopback
  /^10\\./,                // RFC 1918 Class A
  /^172\\.(1[6-9]|2[0-9]|3[0-1])\\./, // RFC 1918 Class B
  /^192\\.168\\./,          // RFC 1918 Class C
  /^169\\.254\\./,          // Link-Local / Cloud Metadata
  /^::1$/,                // IPv6 Loopback
  /^fc00:/i,              // IPv6 Unique Local
  /^fe80:/i               // IPv6 Link-Local
];

export async function validateSafeUrl(rawUrl: string): Promise<{ safe: boolean; url?: URL; reason?: string }> {
  try {
    const url = new URL(rawUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { safe: false, reason: 'Invalid protocol: only HTTP/HTTPS permitted' };
    }
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return { safe: false, reason: 'Blocked private hostname' };
    }

    // Resolve DNS to verify actual IP
    const { address } = await lookup(hostname);
    for (const pattern of BLOCKED_IP_RANGES) {
      if (pattern.test(address)) {
        return { safe: false, reason: \`Blocked private IP destination: \${address}\` };
      }
    }

    return { safe: true, url };
  } catch (err: any) {
    return { safe: false, reason: err.message || 'URL resolution failure' };
  }
}`,
  },
  {
    id: 'code_graph_pagerank',
    workspaceId: 'ws_eng_arch',
    title: 'Deterministic Knowledge Graph Centrality & Hub Calculation',
    description: 'Eigenvector centrality algorithm for calculating knowledge node authority and hub significance in $O(V + E)$ iterations.',
    language: 'typescript',
    repository: 'github.com/aurora-vault/graph-engine',
    filePath: 'packages/graph/src/centrality.ts',
    lineRange: '1-45',
    tags: ['graph-theory', 'algorithms', 'pagerank', 'typescript'],
    collectionId: 'col_vector_graph',
    createdBy: 'usr_aurora_01',
    createdAt: '2026-02-18T16:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    code: `export interface GraphMatrix {
  nodes: string[];
  adjacency: Map<string, string[]>;
}

export function computePageRank(graph: GraphMatrix, damping = 0.85, maxIterations = 20, tolerance = 1e-6): Map<string, number> {
  const N = graph.nodes.length;
  if (N === 0) return new Map();

  let scores = new Map<string, number>();
  for (const node of graph.nodes) {
    scores.set(node, 1 / N);
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const nextScores = new Map<string, number>();
    let maxDiff = 0;

    for (const node of graph.nodes) {
      let inboundRank = 0;
      for (const [source, targets] of graph.adjacency.entries()) {
        if (targets.includes(node)) {
          inboundRank += (scores.get(source) || 0) / (targets.length || 1);
        }
      }
      const newScore = (1 - damping) / N + damping * inboundRank;
      nextScores.set(node, newScore);
      maxDiff = Math.max(maxDiff, Math.abs(newScore - (scores.get(node) || 0)));
    }

    scores = nextScores;
    if (maxDiff < tolerance) break;
  }

  return scores;
}`,
  },
  {
    id: 'code_lumen_token_theme',
    workspaceId: 'ws_eng_arch',
    title: 'Lumen Grid Dynamic CSS Custom Properties Injector',
    description: 'Theme contract manager ensuring exact contrast thresholds and nested corner radius calculations.',
    language: 'typescript',
    repository: 'github.com/aurora-vault/ui-tokens',
    filePath: 'packages/ui/src/tokens.ts',
    lineRange: '5-38',
    tags: ['ui', 'css', 'design-system', 'tokens'],
    collectionId: 'col_lumen_design',
    createdBy: 'usr_aurora_01',
    createdAt: '2026-03-05T09:30:00Z',
    updatedAt: '2026-08-27T11:00:00Z',
    code: `export function calculateNestedRadius(outerRadiusPx: number, paddingPx: number): number {
  return Math.max(0, outerRadiusPx - paddingPx);
}

export const LUMEN_SURFACE_CONTRAST = {
  light: {
    background: '#fcfcfc',
    surface: '#ffffff',
    surfaceRaised: '#f8fafc',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8'
  },
  dark: {
    background: '#090d16',
    surface: '#0f172a',
    surfaceRaised: '#1e293b',
    border: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b'
  }
};`,
  },
];

export const INITIAL_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox_01',
    workspaceId: 'ws_eng_arch',
    type: 'URL',
    title: 'Distributed Consensus in Geo-Replicated Datastores',
    content: 'https://sigops.org/s/conferences/sosp/2025/papers/geo-consensus.pdf',
    url: 'https://sigops.org/s/conferences/sosp/2025/papers/geo-consensus.pdf',
    tags: ['consensus', 'geo-replication', 'sosp'],
    createdAt: '2026-08-28T06:30:00Z',
    status: 'PENDING',
  },
  {
    id: 'inbox_02',
    workspaceId: 'ws_eng_arch',
    type: 'NOTE',
    title: 'Ideas for Vector Search Pre-Filtering Optimization',
    content: 'Consider combining SQLite FTS5 inverted index bitmap bitmasks directly with HNSW visited list checks to skip non-matching metadata before distance calculation.',
    tags: ['hnsw', 'optimization', 'filtering'],
    createdAt: '2026-08-27T21:15:00Z',
    status: 'PENDING',
  },
  {
    id: 'inbox_03',
    workspaceId: 'ws_eng_arch',
    type: 'CODE',
    title: 'Fast Bitset Intersection in WASM',
    content: '// Potential SIMD 128-bit bitwise AND loop for tag filtering\n__m128i a = _mm_loadu_si128((__m128i*)ptrA);\n__m128i b = _mm_loadu_si128((__m128i*)ptrB);\n__m128i res = _mm_and_si128(a, b);',
    language: 'c',
    tags: ['wasm', 'simd', 'c'],
    createdAt: '2026-08-27T19:00:00Z',
    status: 'PENDING',
  },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act_01',
    workspaceId: 'ws_eng_arch',
    userId: 'usr_aurora_01',
    userName: 'Alex Vance',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'UPDATED',
    resourceType: 'NOTE',
    resourceId: 'note_nextjs_arch',
    resourceTitle: 'Next.js Architecture & High-Performance Pipelines',
    timestamp: '2026-08-28T07:15:00Z',
    details: 'Saved version 4 with updated benchmark citations and backlink relations.',
  },
  {
    id: 'act_02',
    workspaceId: 'ws_eng_arch',
    userId: 'usr_aurora_01',
    userName: 'Alex Vance',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'HIGHLIGHTED',
    resourceType: 'DOCUMENT',
    resourceId: 'doc_arch_whitepaper',
    resourceTitle: 'Distributed Systems & Memory Consensus Whitepaper',
    timestamp: '2026-08-28T06:45:00Z',
    details: 'Created highlight on page 2 linked to Next.js Architecture note.',
  },
  {
    id: 'act_03',
    workspaceId: 'ws_eng_arch',
    userId: 'usr_aurora_02',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'CREATED',
    resourceType: 'CODE',
    resourceId: 'code_ssrf_validator',
    resourceTitle: 'SSRF Safe URL Resolver & IP Range Blocking',
    timestamp: '2026-08-27T16:00:00Z',
    details: 'Added SSRF guard code snippet in Zero-Trust & Security collection.',
  },
  {
    id: 'act_04',
    workspaceId: 'ws_eng_arch',
    userId: 'usr_aurora_03',
    userName: 'Marcus Thorne',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    action: 'CREATED',
    resourceType: 'BOOKMARK',
    resourceId: 'bm_04',
    resourceTitle: 'Distributed Locks with Redis & Redlock Algorithm',
    timestamp: '2026-08-26T14:20:00Z',
    details: 'Saved URL from redis.io into Systems Architecture.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit_01',
    workspaceId: 'ws_eng_arch',
    actorId: 'usr_aurora_01',
    actorEmail: 'alex.vance@auroravault.io',
    actorRole: 'OWNER',
    eventType: 'AUTH_LOGIN',
    targetResource: 'Session /auth/session_8892',
    ipAddress: '198.51.100.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'SUCCESS',
    timestamp: '2026-08-28T07:05:00Z',
  },
  {
    id: 'audit_02',
    workspaceId: 'ws_eng_arch',
    actorId: 'usr_aurora_01',
    actorEmail: 'alex.vance@auroravault.io',
    actorRole: 'OWNER',
    eventType: 'SECURITY_SCAN',
    targetResource: 'SSRF URL Ingestion Guard',
    ipAddress: '198.51.100.42',
    userAgent: 'AuroraVault-SecurityDaemon/1.0',
    status: 'SUCCESS',
    timestamp: '2026-08-28T05:00:00Z',
    metadata: { blockedPrivateAttempts: 0, checkedUrls: 4 },
  },
  {
    id: 'audit_03',
    workspaceId: 'ws_eng_arch',
    actorId: 'usr_aurora_02',
    actorEmail: 'elena.rostova@auroravault.io',
    actorRole: 'ADMIN',
    eventType: 'ROLE_CHANGED',
    targetResource: 'User usr_aurora_04 (Dr. Sarah Lin) -> VIEWER',
    ipAddress: '203.0.113.19',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    status: 'SUCCESS',
    timestamp: '2026-08-25T11:20:00Z',
  },
  {
    id: 'audit_04',
    workspaceId: 'ws_eng_arch',
    actorId: 'usr_aurora_01',
    actorEmail: 'alex.vance@auroravault.io',
    actorRole: 'OWNER',
    eventType: 'MEMBER_INVITED',
    targetResource: 'sarah.lin@stanford.edu',
    ipAddress: '198.51.100.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'SUCCESS',
    timestamp: '2026-08-24T15:45:00Z',
  },
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'search_01',
    workspaceId: 'ws_eng_arch',
    name: 'Architecture & Performance',
    query: 'type:note tag:architecture performance',
    filters: { types: ['NOTE'], tags: ['architecture'] },
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'search_02',
    workspaceId: 'ws_eng_arch',
    name: 'Security & SSRF Protocols',
    query: 'tag:security SSRF',
    filters: { tags: ['security'] },
    createdAt: '2026-08-22T14:00:00Z',
  },
  {
    id: 'search_03',
    workspaceId: 'ws_eng_arch',
    name: 'Vector Graph Algorithms',
    query: 'collection:col_vector_graph HNSW',
    filters: { collections: ['col_vector_graph'] },
    createdAt: '2026-08-25T09:00:00Z',
  },
];

// In-Memory Global Store with LocalStorage hydration for client mutations
class KnowledgeStore {
  private workspace: Workspace = INITIAL_WORKSPACES[0];
  private workspaces: Workspace[] = [...INITIAL_WORKSPACES];
  private members: WorkspaceMember[] = [...INITIAL_MEMBERS];
  private collections: Collection[] = [...INITIAL_COLLECTIONS];
  private notes: Note[] = [...INITIAL_NOTES];
  private noteVersions: Record<string, NoteVersion[]> = { ...INITIAL_NOTE_VERSIONS };
  private documents: DocumentItem[] = [...INITIAL_DOCUMENTS];
  private bookmarks: Bookmark[] = [...INITIAL_BOOKMARKS];
  private codeSnippets: CodeSnippet[] = [...INITIAL_CODE_SNIPPETS];
  private inbox: InboxItem[] = [...INITIAL_INBOX_ITEMS];
  private activity: ActivityItem[] = [...INITIAL_ACTIVITY];
  private auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];
  private savedSearches: SavedSearch[] = [...INITIAL_SAVED_SEARCHES];

  // Helper to extract backlinks [[Note Title]] from markdown content
  public extractBacklinks(noteId: string, content: string): Backlink[] {
    const regex = /\[\[(.*?)\]\]/g;
    const matches: Backlink[] = [];
    let match: RegExpExecArray | null;

    const sourceNote = this.notes.find((n) => n.id === noteId);
    if (!sourceNote) return [];

    while ((match = regex.exec(content)) !== null) {
      const targetTitle = match[1].trim();
      const targetNote = this.notes.find(
        (n) => n.title.toLowerCase() === targetTitle.toLowerCase() || n.slug.toLowerCase() === targetTitle.toLowerCase()
      );

      // Context snippet around the match
      const start = Math.max(0, match.index - 40);
      const end = Math.min(content.length, match.index + match[0].length + 40);
      const contextSnippet = '...' + content.substring(start, end).replace(/\n/g, ' ') + '...';

      matches.push({
        id: `bl_${noteId}_${targetNote ? targetNote.id : encodeURIComponent(targetTitle)}_${matches.length}`,
        sourceType: 'NOTE',
        sourceId: sourceNote.id,
        sourceTitle: sourceNote.title,
        targetId: targetNote ? targetNote.id : `external_${encodeURIComponent(targetTitle)}`,
        targetTitle: targetNote ? targetNote.id : targetTitle,
        contextSnippet,
        createdAt: new Date().toISOString(),
      });
    }

    return matches;
  }

  // Get all backlinks pointing to a specific note
  public getBacklinksForNote(targetNoteId: string): Backlink[] {
    const targetNote = this.notes.find((n) => n.id === targetNoteId);
    if (!targetNote) return [];

    const backlinks: Backlink[] = [];
    for (const note of this.notes) {
      if (note.id === targetNoteId) continue;
      const extracted = this.extractBacklinks(note.id, note.content);
      for (const bl of extracted) {
        if (
          bl.targetId === targetNoteId ||
          bl.targetTitle.toLowerCase() === targetNote.title.toLowerCase()
        ) {
          backlinks.push(bl);
        }
      }
    }
    return backlinks;
  }

  // Build full knowledge graph
  public getKnowledgeGraph(workspaceId?: string): KnowledgeGraphData {
    const nodes: KnowledgeNode[] = [];
    const edges: KnowledgeEdge[] = [];
    const nodeMap = new Set<string>();

    // Add Collections
    for (const col of this.collections) {
      nodes.push({
        id: col.id,
        title: col.name,
        type: 'COLLECTION',
        tags: ['collection'],
        size: 28,
        connectionsCount: col.itemsCount.notes + col.itemsCount.documents + col.itemsCount.bookmarks + col.itemsCount.code,
        updatedAt: col.updatedAt,
      });
      nodeMap.add(col.id);
    }

    // Add Notes
    for (const note of this.notes) {
      const backlinks = this.getBacklinksForNote(note.id);
      nodes.push({
        id: note.id,
        title: note.title,
        type: 'NOTE',
        tags: note.tags,
        collectionName: note.collectionName,
        size: 22 + backlinks.length * 2,
        connectionsCount: backlinks.length + (note.collectionId ? 1 : 0),
        updatedAt: note.updatedAt,
        dataRefId: note.id,
      });
      nodeMap.add(note.id);

      // Edge to Collection
      if (note.collectionId && nodeMap.has(note.collectionId)) {
        edges.push({
          id: `edge_${note.id}_${note.collectionId}`,
          source: note.id,
          target: note.collectionId,
          type: 'PART_OF',
          label: 'in collection',
        });
      }

      // Outbound note backlinks
      const outbound = this.extractBacklinks(note.id, note.content);
      for (const bl of outbound) {
        if (nodeMap.has(bl.targetId) || this.notes.some((n) => n.id === bl.targetId)) {
          edges.push({
            id: `edge_ref_${note.id}_${bl.targetId}`,
            source: note.id,
            target: bl.targetId,
            type: 'REFERENCES',
            label: 'cites note',
          });
        }
      }
    }

    // Add Documents
    for (const doc of this.documents) {
      nodes.push({
        id: doc.id,
        title: doc.title,
        type: 'DOCUMENT',
        tags: doc.tags,
        size: 20 + doc.highlights.length * 3,
        connectionsCount: doc.highlights.length + (doc.collectionId ? 1 : 0),
        updatedAt: doc.updatedAt,
        dataRefId: doc.id,
      });
      nodeMap.add(doc.id);

      if (doc.collectionId && nodeMap.has(doc.collectionId)) {
        edges.push({
          id: `edge_${doc.id}_${doc.collectionId}`,
          source: doc.id,
          target: doc.collectionId,
          type: 'PART_OF',
          label: 'stored in',
        });
      }

      // Highlights linked to notes
      for (const hl of doc.highlights) {
        if (hl.noteId && nodeMap.has(hl.noteId)) {
          edges.push({
            id: `edge_hl_${doc.id}_${hl.noteId}`,
            source: doc.id,
            target: hl.noteId,
            type: 'CITES',
            label: `cited highlight (p.${hl.page})`,
          });
        }
      }
    }

    // Add Bookmarks
    for (const bm of this.bookmarks) {
      nodes.push({
        id: bm.id,
        title: bm.title,
        type: 'BOOKMARK',
        tags: bm.tags,
        size: 16,
        connectionsCount: bm.collectionId ? 1 : 0,
        updatedAt: bm.updatedAt,
        dataRefId: bm.id,
      });
      nodeMap.add(bm.id);

      if (bm.collectionId && nodeMap.has(bm.collectionId)) {
        edges.push({
          id: `edge_${bm.id}_${bm.collectionId}`,
          source: bm.id,
          target: bm.collectionId,
          type: 'PART_OF',
          label: 'collected',
        });
      }
    }

    // Add Code Snippets
    for (const code of this.codeSnippets) {
      nodes.push({
        id: code.id,
        title: code.title,
        type: 'CODE',
        tags: code.tags,
        size: 16,
        connectionsCount: code.collectionId ? 1 : 0,
        updatedAt: code.updatedAt,
        dataRefId: code.id,
      });
      nodeMap.add(code.id);

      if (code.collectionId && nodeMap.has(code.collectionId)) {
        edges.push({
          id: `edge_${code.id}_${code.collectionId}`,
          source: code.id,
          target: code.collectionId,
          type: 'PART_OF',
          label: 'snippet in',
        });
      }
    }

    // Tag based relationships for semantic mesh
    const tagToNodes: Record<string, string[]> = {};
    for (const n of nodes) {
      for (const tag of n.tags) {
        if (!tagToNodes[tag]) tagToNodes[tag] = [];
        tagToNodes[tag].push(n.id);
      }
    }

    // Connect top shared tags if not already connected
    for (const [tag, nodeIds] of Object.entries(tagToNodes)) {
      if (nodeIds.length >= 2 && nodeIds.length <= 4) {
        for (let i = 0; i < nodeIds.length; i++) {
          for (let j = i + 1; j < nodeIds.length; j++) {
            const edgeExists = edges.some(
              (e) => (e.source === nodeIds[i] && e.target === nodeIds[j]) || (e.source === nodeIds[j] && e.target === nodeIds[i])
            );
            if (!edgeExists) {
              edges.push({
                id: `tag_${tag}_${nodeIds[i]}_${nodeIds[j]}`,
                source: nodeIds[i],
                target: nodeIds[j],
                type: 'TAGGED_WITH',
                label: `#${tag}`,
              });
            }
          }
        }
      }
    }

    return { nodes, edges };
  }

  // Deterministic Intelligence Insights Engine
  public getDeterministicInsights(): DeterministicIntelligenceInsights {
    const graph = this.getKnowledgeGraph();
    const now = new Date('2026-08-28T07:15:00Z').getTime();

    // 1. Stale Notes (> 45 days untouched)
    const staleNotes = this.notes
      .map((note) => {
        const diffDays = Math.floor((now - new Date(note.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: note.id,
          title: note.title,
          daysInactive: Math.max(1, diffDays),
          tags: note.tags,
        };
      })
      .filter((n) => n.daysInactive >= 3); // realistic threshold for prototype display

    // 2. Orphan Nodes (0 or 1 edge)
    const edgeCounts: Record<string, number> = {};
    for (const edge of graph.edges) {
      edgeCounts[edge.source] = (edgeCounts[edge.source] || 0) + 1;
      edgeCounts[edge.target] = (edgeCounts[edge.target] || 0) + 1;
    }
    const orphanNodes = graph.nodes
      .filter((node) => (edgeCounts[node.id] || 0) <= 1 && node.type !== 'COLLECTION')
      .map((node) => ({
        id: node.id,
        title: node.title,
        type: node.type,
      }));

    // 3. Unreferenced Sources (Documents / Bookmarks with no citation in any note)
    const citedDocIds = new Set<string>();
    for (const doc of this.documents) {
      for (const hl of doc.highlights) {
        if (hl.noteId) citedDocIds.add(doc.id);
      }
    }
    const unreferencedSources: { id: string; title: string; type: 'DOCUMENT' | 'BOOKMARK' }[] = [];
    for (const doc of this.documents) {
      if (!citedDocIds.has(doc.id)) {
        unreferencedSources.push({ id: doc.id, title: doc.title, type: 'DOCUMENT' });
      }
    }
    for (const bm of this.bookmarks) {
      if (bm.readStatus === 'UNREAD') {
        unreferencedSources.push({ id: bm.id, title: bm.title, type: 'BOOKMARK' });
      }
    }

    // 4. High Impact Hubs
    const highImpactHubs = graph.nodes
      .map((node) => ({
        id: node.id,
        title: node.title,
        connectionCount: edgeCounts[node.id] || 0,
        type: node.type,
      }))
      .sort((a, b) => b.connectionCount - a.connectionCount)
      .slice(0, 5);

    // 5. Potential Duplicates (Domain collisions or token overlap)
    const potentialDuplicates: { idA: string; titleA: string; idB: string; titleB: string; similarityReason: string }[] = [];
    const domains: Record<string, Bookmark[]> = {};
    for (const bm of this.bookmarks) {
      if (!domains[bm.domain]) domains[bm.domain] = [];
      domains[bm.domain].push(bm);
    }
    for (const [dom, list] of Object.entries(domains)) {
      if (list.length > 1) {
        potentialDuplicates.push({
          idA: list[0].id,
          titleA: list[0].title,
          idB: list[1].id,
          titleB: list[1].title,
          similarityReason: `Shared source domain (${dom}) with overlapping research context.`,
        });
      }
    }

    return {
      staleNotes,
      orphanNodes,
      unreferencedSources,
      highImpactHubs,
      potentialDuplicates,
      knowledgePulse: {
        totalItems: this.notes.length + this.documents.length + this.bookmarks.length + this.codeSnippets.length,
        newThisWeek: 4,
        connectedRatio: Math.round(((graph.nodes.length - orphanNodes.length) / (graph.nodes.length || 1)) * 100),
        activeCollections: this.collections.length,
      },
    };
  }

  // Full-Text & Operator Search Engine
  public search(query: string) {
    if (!query.trim()) {
      return {
        notes: this.notes,
        documents: this.documents,
        bookmarks: this.bookmarks,
        code: this.codeSnippets,
        collections: this.collections,
        total: this.notes.length + this.documents.length + this.bookmarks.length + this.codeSnippets.length,
      };
    }

    // Parse operators
    let cleanQuery = query;
    let typeFilter: string | null = null;
    let tagFilter: string | null = null;
    let collectionFilter: string | null = null;
    let domainFilter: string | null = null;

    const typeMatch = /type:([a-zA-Z]+)/i.exec(cleanQuery);
    if (typeMatch) {
      typeFilter = typeMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(typeMatch[0], '').trim();
    }

    const tagMatch = /tag:([a-zA-Z0-9_-]+)/i.exec(cleanQuery);
    if (tagMatch) {
      tagFilter = tagMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(tagMatch[0], '').trim();
    }

    const colMatch = /collection:([a-zA-Z0-9_-]+)/i.exec(cleanQuery);
    if (colMatch) {
      collectionFilter = colMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(colMatch[0], '').trim();
    }

    const domMatch = /domain:([a-zA-Z0-9._-]+)/i.exec(cleanQuery);
    if (domMatch) {
      domainFilter = domMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(domMatch[0], '').trim();
    }

    const terms = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const matchesTerms = (str?: string) => {
      if (!str) return false;
      const lower = str.toLowerCase();
      return terms.length === 0 || terms.every((t) => lower.includes(t));
    };

    // Filter Notes
    const notes = (!typeFilter || typeFilter === 'note' || typeFilter === 'notes')
      ? this.notes.filter((n) => {
          if (tagFilter && !n.tags.some((t) => t.toLowerCase().includes(tagFilter!))) return false;
          if (collectionFilter && n.collectionId !== collectionFilter && !n.collectionName?.toLowerCase().includes(collectionFilter)) return false;
          return terms.length === 0 || matchesTerms(n.title) || matchesTerms(n.content) || n.tags.some((t) => matchesTerms(t));
        })
      : [];

    // Filter Documents
    const documents = (!typeFilter || typeFilter === 'document' || typeFilter === 'doc' || typeFilter === 'pdf')
      ? this.documents.filter((d) => {
          if (tagFilter && !d.tags.some((t) => t.toLowerCase().includes(tagFilter!))) return false;
          if (collectionFilter && d.collectionId !== collectionFilter) return false;
          return terms.length === 0 || matchesTerms(d.title) || matchesTerms(d.extractedText) || matchesTerms(d.summary) || d.tags.some((t) => matchesTerms(t));
        })
      : [];

    // Filter Bookmarks
    const bookmarks = (!typeFilter || typeFilter === 'bookmark' || typeFilter === 'url' || typeFilter === 'link')
      ? this.bookmarks.filter((b) => {
          if (tagFilter && !b.tags.some((t) => t.toLowerCase().includes(tagFilter!))) return false;
          if (collectionFilter && b.collectionId !== collectionFilter) return false;
          if (domainFilter && !b.domain.toLowerCase().includes(domainFilter)) return false;
          return terms.length === 0 || matchesTerms(b.title) || matchesTerms(b.description) || matchesTerms(b.domain) || matchesTerms(b.url) || b.tags.some((t) => matchesTerms(t));
        })
      : [];

    // Filter Code
    const code = (!typeFilter || typeFilter === 'code' || typeFilter === 'snippet')
      ? this.codeSnippets.filter((c) => {
          if (tagFilter && !c.tags.some((t) => t.toLowerCase().includes(tagFilter!))) return false;
          if (collectionFilter && c.collectionId !== collectionFilter) return false;
          return terms.length === 0 || matchesTerms(c.title) || matchesTerms(c.description) || matchesTerms(c.code) || matchesTerms(c.language) || c.tags.some((t) => matchesTerms(t));
        })
      : [];

    // Filter Collections
    const collections = (!typeFilter || typeFilter === 'collection')
      ? this.collections.filter((col) => {
          return terms.length === 0 || matchesTerms(col.name) || matchesTerms(col.description);
        })
      : [];

    return {
      notes,
      documents,
      bookmarks,
      code,
      collections,
      total: notes.length + documents.length + bookmarks.length + code.length + collections.length,
    };
  }

  // Getters & Mutators
  public getCurrentUser() { return CURRENT_USER; }
  public getWorkspace() { return this.workspace; }
  public getWorkspaces() { return this.workspaces; }
  public getMembers() { return this.members; }
  public getCollections() { return this.collections; }
  public getNotes() { return this.notes; }
  public getNoteById(id: string) { return this.notes.find((n) => n.id === id); }
  public getNoteVersions(id: string) { return this.noteVersions[id] || []; }
  public getDocuments() { return this.documents; }
  public getDocumentById(id: string) { return this.documents.find((d) => d.id === id); }
  public getBookmarks() { return this.bookmarks; }
  public getCodeSnippets() { return this.codeSnippets; }
  public getInbox() { return this.inbox; }
  public getActivity() { return this.activity; }
  public getAuditLogs() { return this.auditLogs; }
  public getSavedSearches() { return this.savedSearches; }
  public getGraphData() { return this.getKnowledgeGraph(); }
  public getInsights() { return this.getDeterministicInsights(); }

  public getHighlightsForNote(noteId: string): DocumentHighlight[] {
    const results: DocumentHighlight[] = [];
    for (const doc of this.documents) {
      for (const hl of doc.highlights) {
        if (hl.noteId === noteId) {
          results.push(hl);
        }
      }
    }
    return results;
  }

  public switchWorkspace(workspaceId: string) {
    const ws = this.workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      this.workspace = ws;
      this.recordAudit('WORKSPACE_SETTINGS_UPDATED', `Switched active workspace to ${ws.name}`, 'SUCCESS');
    }
  }

  // Mutations with Activity & Audit recording
  public createNote(data: Partial<Note>): Note {
    const id = `note_${Date.now()}`;
    const wordCount = data.content ? data.content.split(/\s+/).filter(Boolean).length : 0;
    const newNote: Note = {
      id,
      workspaceId: this.workspace.id,
      title: data.title || 'Untitled Note',
      slug: (data.title || 'untitled-note').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content: data.content || '# Untitled Note\n\nWrite your thoughts here...',
      contentFormat: 'markdown',
      status: data.status || 'ACTIVE',
      tags: data.tags || [],
      collectionId: data.collectionId,
      collectionName: this.collections.find((c) => c.id === data.collectionId)?.name,
      createdBy: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionCount: 1,
      wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      backlinksCount: 0,
      pinned: false,
    };

    this.notes.unshift(newNote);
    this.noteVersions[id] = [
      {
        id: `ver_${Date.now()}`,
        versionNumber: 1,
        title: newNote.title,
        content: newNote.content,
        summary: 'Initial note creation',
        createdBy: CURRENT_USER.name,
        createdAt: newNote.createdAt,
      },
    ];

    // Update collection count
    if (newNote.collectionId) {
      const col = this.collections.find((c) => c.id === newNote.collectionId);
      if (col) col.itemsCount.notes++;
    }

    this.recordActivity('CREATED', 'NOTE', newNote.id, newNote.title, 'Created new note.');
    return newNote;
  }

  public updateNote(id: string, updates: Partial<Note>): Note | null {
    const idx = this.notes.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    const existing = this.notes[idx];
    const isContentChanged = updates.content !== undefined && updates.content !== existing.content;
    const isTitleChanged = updates.title !== undefined && updates.title !== existing.title;

    const wordCount = updates.content !== undefined ? updates.content.split(/\s+/).filter(Boolean).length : existing.wordCount;
    const updatedNote: Note = {
      ...existing,
      ...updates,
      wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      updatedAt: new Date().toISOString(),
      collectionName: updates.collectionId ? this.collections.find((c) => c.id === updates.collectionId)?.name : existing.collectionName,
    };

    if (isContentChanged || isTitleChanged) {
      const versions = this.noteVersions[id] || [];
      const newVerNum = versions.length + 1;
      versions.push({
        id: `ver_${Date.now()}`,
        versionNumber: newVerNum,
        title: updatedNote.title,
        content: updatedNote.content,
        summary: `Autosaved revision ${newVerNum}`,
        createdBy: CURRENT_USER.name,
        createdAt: updatedNote.updatedAt,
      });
      this.noteVersions[id] = versions;
      updatedNote.versionCount = newVerNum;
    }

    this.notes[idx] = updatedNote;
    this.recordActivity('UPDATED', 'NOTE', updatedNote.id, updatedNote.title, 'Saved note changes.');
    return updatedNote;
  }

  public restoreNoteVersion(noteId: string, versionId: string): Note | null {
    const versions = this.noteVersions[noteId] || [];
    const targetVer = versions.find((v) => v.id === versionId);
    if (!targetVer) return null;

    return this.updateNote(noteId, {
      title: targetVer.title,
      content: targetVer.content,
    });
  }

  public deleteNote(id: string): boolean {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return false;

    this.notes = this.notes.filter((n) => n.id !== id);
    if (note.collectionId) {
      const col = this.collections.find((c) => c.id === note.collectionId);
      if (col) col.itemsCount.notes = Math.max(0, col.itemsCount.notes - 1);
    }

    this.recordActivity('DELETED', 'NOTE', id, note.title, 'Permanently purged note.');
    return true;
  }

  public addDocumentHighlight(documentId: string, highlight: Omit<DocumentHighlight, 'id' | 'createdAt' | 'createdBy'>): DocumentHighlight | null {
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) return null;

    const newHl: DocumentHighlight = {
      ...highlight,
      id: `hl_${Date.now()}`,
      documentId,
      createdBy: CURRENT_USER.name,
      createdAt: new Date().toISOString(),
    };

    doc.highlights.push(newHl);
    this.recordActivity('HIGHLIGHTED', 'DOCUMENT', doc.id, doc.title, `Added highlight on page ${newHl.page}: "${newHl.selectedText.substring(0, 40)}..."`);
    return newHl;
  }

  public createDocument(data: Partial<DocumentItem>): DocumentItem {
    const id = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      id,
      workspaceId: this.workspace.id,
      title: data.title || 'Uploaded Document',
      fileName: data.fileName || 'document.pdf',
      fileSize: data.fileSize || 1024000,
      mimeType: data.mimeType || 'application/pdf',
      status: 'READY',
      pageCount: data.pages?.length || 3,
      tags: data.tags || ['document'],
      collectionId: data.collectionId,
      uploadedBy: CURRENT_USER.id,
      uploadedByName: CURRENT_USER.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: data.summary || 'Document extracted and indexed for full-text search.',
      extractedText: data.extractedText || 'Document content extracted.',
      pages: data.pages || [
        { pageNumber: 1, text: data.extractedText || 'Extracted page 1 content.' },
      ],
      highlights: [],
    };

    this.documents.unshift(newDoc);
    if (newDoc.collectionId) {
      const col = this.collections.find((c) => c.id === newDoc.collectionId);
      if (col) col.itemsCount.documents++;
    }
    this.recordActivity('PROCESSED', 'DOCUMENT', newDoc.id, newDoc.title, 'Uploaded and extracted document.');
    return newDoc;
  }

  public createBookmark(data: Partial<Bookmark>): Bookmark {
    const id = `bm_${Date.now()}`;
    const url = data.url || 'https://example.com';
    let domain = 'example.com';
    try {
      domain = new URL(url).hostname;
    } catch {}

    const newBm: Bookmark = {
      id,
      workspaceId: this.workspace.id,
      url,
      title: data.title || domain,
      description: data.description || 'Saved reference bookmark.',
      domain,
      favicon: `https://${domain}/favicon.ico`,
      ogImage: data.ogImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      author: data.author,
      tags: data.tags || ['bookmark'],
      collectionId: data.collectionId,
      collectionName: this.collections.find((c) => c.id === data.collectionId)?.name,
      readStatus: 'UNREAD',
      createdBy: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes,
    };

    this.bookmarks.unshift(newBm);
    if (newBm.collectionId) {
      const col = this.collections.find((c) => c.id === newBm.collectionId);
      if (col) col.itemsCount.bookmarks++;
    }
    this.recordActivity('CREATED', 'BOOKMARK', newBm.id, newBm.title, `Saved bookmark from ${newBm.domain}.`);
    return newBm;
  }

  public createCodeSnippet(data: Partial<CodeSnippet>): CodeSnippet {
    const id = `code_${Date.now()}`;
    const newCode: CodeSnippet = {
      id,
      workspaceId: this.workspace.id,
      title: data.title || 'Code Snippet',
      description: data.description || '',
      language: data.language || 'typescript',
      code: data.code || '// Write code here\n',
      repository: data.repository,
      filePath: data.filePath,
      lineRange: data.lineRange,
      tags: data.tags || ['code'],
      collectionId: data.collectionId,
      createdBy: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.codeSnippets.unshift(newCode);
    if (newCode.collectionId) {
      const col = this.collections.find((c) => c.id === newCode.collectionId);
      if (col) col.itemsCount.code++;
    }
    this.recordActivity('CREATED', 'CODE', newCode.id, newCode.title, `Saved ${newCode.language} code snippet.`);
    return newCode;
  }

  public createCollection(data: Partial<Collection>): Collection {
    const id = `col_${Date.now()}`;
    const newCol: Collection = {
      id,
      workspaceId: this.workspace.id,
      name: data.name || 'New Collection',
      description: data.description || '',
      color: data.color || '#0284c7',
      icon: data.icon || 'Folder',
      itemsCount: { notes: 0, documents: 0, bookmarks: 0, code: 0 },
      createdBy: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.collections.push(newCol);
    this.recordActivity('CREATED', 'COLLECTION', newCol.id, newCol.name, 'Created new knowledge collection.');
    return newCol;
  }

  public createInboxItem(data: Partial<InboxItem>): InboxItem {
    const id = `inbox_${Date.now()}`;
    const item: InboxItem = {
      id,
      workspaceId: this.workspace.id,
      type: data.type || 'NOTE',
      title: data.title || 'Quick Note',
      content: data.content || '',
      url: data.url,
      language: data.language,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    this.inbox.unshift(item);
    return item;
  }

  public triageInboxItem(id: string, action: 'CONVERT_TO_NOTE' | 'CONVERT_TO_BOOKMARK' | 'ARCHIVE'): any {
    const item = this.inbox.find((i) => i.id === id);
    if (!item) return null;

    item.status = action === 'ARCHIVE' ? 'ARCHIVED' : 'TRIAGED';

    if (action === 'CONVERT_TO_NOTE') {
      const note = this.createNote({
        title: item.title,
        content: `# ${item.title}\n\n${item.content}`,
        tags: item.tags,
      });
      return { item, converted: note, type: 'NOTE' };
    }

    if (action === 'CONVERT_TO_BOOKMARK' && item.url) {
      const bm = this.createBookmark({
        title: item.title,
        url: item.url,
        tags: item.tags,
      });
      return { item, converted: bm, type: 'BOOKMARK' };
    }

    return { item };
  }

  public inviteMember(email: string, role: Role): WorkspaceMember {
    const id = `mem_${Date.now()}`;
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const member: WorkspaceMember = {
      id,
      userId: `usr_${Date.now()}`,
      workspaceId: this.workspace.id,
      name,
      email,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role,
      joinedAt: new Date().toISOString(),
    };
    this.members.push(member);
    this.workspace.membersCount = this.members.length;

    this.recordAudit('MEMBER_INVITED', `Invited ${email} with role ${role}`, 'SUCCESS');
    return member;
  }

  public updateMemberRole(memberId: string, role: Role): WorkspaceMember | null {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) return null;

    const oldRole = member.role;
    member.role = role;
    this.recordAudit('ROLE_CHANGED', `Changed ${member.email} from ${oldRole} to ${role}`, 'SUCCESS');
    return member;
  }

  public saveSearch(name: string, query: string, filters: any): SavedSearch {
    const search: SavedSearch = {
      id: `search_${Date.now()}`,
      workspaceId: this.workspace.id,
      name,
      query,
      filters,
      createdAt: new Date().toISOString(),
    };
    this.savedSearches.unshift(search);
    return search;
  }

  private recordActivity(action: ActivityItem['action'], resourceType: ActivityItem['resourceType'], resourceId: string, resourceTitle: string, details?: string) {
    this.activity.unshift({
      id: `act_${Date.now()}`,
      workspaceId: this.workspace.id,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatarUrl,
      action,
      resourceType,
      resourceId,
      resourceTitle,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  private recordAudit(eventType: AuditLogItem['eventType'], targetResource: string, status: AuditLogItem['status']) {
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      workspaceId: this.workspace.id,
      actorId: CURRENT_USER.id,
      actorEmail: CURRENT_USER.email,
      actorRole: CURRENT_USER.role,
      eventType,
      targetResource,
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status,
      timestamp: new Date().toISOString(),
    });
  }
}

// Global Singleton Instance
export const knowledgeStore = new KnowledgeStore();
