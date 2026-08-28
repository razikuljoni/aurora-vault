import { LucideIcon } from 'lucide-react';

export interface NoteTemplate {
  id: string;
  name: string;
  category: 'general' | 'engineering' | 'research' | 'meeting' | 'product' | 'daily';
  icon: string;
  badge: string;
  description: string;
  defaultTitle: string;
  defaultTags: string[];
  content: string;
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    category: 'general',
    icon: 'FileText',
    badge: 'Standard',
    description: 'Clean minimal markdown document with no pre-defined layout.',
    defaultTitle: 'Untitled Note',
    defaultTags: ['note'],
    content: `# Untitled Note

Write your thoughts here using Markdown and [[wikilinks]]...
`,
  },
  {
    id: 'meeting',
    name: 'Meeting Notes & Action Items',
    category: 'meeting',
    icon: 'Users',
    badge: 'Collaboration',
    description: 'Structured layout for standups, syncs, key decisions, and tracked action items.',
    defaultTitle: 'Meeting: [Topic / Working Group]',
    defaultTags: ['meeting', 'sync', 'action-items'],
    content: `# Meeting: [Topic / Working Group]

**Date:** ${new Date().toISOString().split('T')[0]}  
**Attendees:** @Alex Vance, @Elena Rostova, @Marcus Thorne  
**Related Knowledge:** [[Systems Architecture]], [[Lumen Grid Design System]]

---

## 🎯 Meeting Objectives
1. Review architectural trade-offs for distributed state persistence.
2. Finalize zero-trust SSRF policy safeguards before production release.

## 💬 Discussion & Notes
- **Key Discussion Point 1:** Discussed SQLite memory-mapped inverted indices versus hybrid vector graphs.
- **Key Discussion Point 2:** Benchmarked network latency thresholds across multi-region read replicas.

## ⚖️ Key Decisions
- [x] Adopted deterministic scoring over probabilistic hallucination metrics.
- [x] Standardized all inter-module references using [[wikilinks]].

## 📋 Action Items
- [ ] **@Alex Vance:** Finalize benchmark script for HNSW vector distance calculation by Friday.
- [ ] **@Elena Rostova:** Review zero-trust sandbox egress firewall rules in [[Zero-Trust & Security]].
- [ ] **@Marcus Thorne:** Sync with frontend team on [[Lumen Grid Dynamic CSS Custom Properties Injector]].
`,
  },
  {
    id: 'research',
    name: 'Research & Literature Synthesis',
    category: 'research',
    icon: 'BookOpen',
    badge: 'Academic',
    description: 'Deep-dive synthesis framework for papers, technical RFCs, and empirical experiments.',
    defaultTitle: 'Research Synthesis: [Hypothesis / Topic]',
    defaultTags: ['research', 'literature-review', 'synthesis'],
    content: `# Research Synthesis: [Hypothesis / Topic]

**Author / Primary Investigator:** @Alex Vance  
**Subject Area:** Graph Theory & Vector Similarity Search  
**Citations & Sources:** [[Distributed Systems & Memory Consensus Whitepaper]], [[Efficient and Robust Approximate Nearest Neighbor Using HNSW]]

---

## 🔬 Core Hypothesis & Problem Statement
> State the central technical or scientific question under investigation.

How does multi-layer heuristic pruning in HNSW graphs affect recall degradation when dataset scale exceeds $10^7$ high-dimensional embeddings?

## 📊 Key Findings & Experimental Data
- **Observation A:** Logarithmic search time $O(\\log N)$ is preserved across $N = 5\\times 10^6$ vectors with sub-millisecond query p99 latency.
- **Observation B:** Memory footprint increases by $1.8\\times$ when storing bidirectional edge pointers in cache-aligned SIMD buffers.

\`\`\`math
Complexity = O(\\log N) \\quad \\text{where } N = |\\text{Vectors}|
\`\`\`

## 🧠 Synthesis & Theoretical Insights
Linking empirical benchmarks to our core system design in [[Next.js Architecture & High-Performance Pipelines]].

## ❓ Open Questions & Future Work
1. Can bitset SIMD masking prune 80% of unreachable nodes prior to calculating Euclidean distance?
2. What are the replication overheads across distributed raft partitions?
`,
  },
  {
    id: 'project_spec',
    name: 'Project Plan & Architecture Spec',
    category: 'engineering',
    icon: 'Cpu',
    badge: 'Architecture',
    description: 'Comprehensive engineering specification covering system design, invariants, and roadmap.',
    defaultTitle: 'Architecture Spec: [System Name]',
    defaultTags: ['architecture', 'spec', 'engineering', 'roadmap'],
    content: `# Architecture Spec: [System Name]

**Status:** Draft | In Review | Approved  
**Owner:** Engineering Architecture Team  
**Collection:** [[Systems Architecture]]

---

## 📌 Executive Summary
A concise description of the engineering project, why it is being built, and measurable success criteria.

## 🏗️ System Architecture & Component Diagram
\`\`\`
+-------------------------------------------------------------+
|                      Client UI (Next.js)                    |
+------------------------------+------------------------------+
                               | (HTTPS / SSE)
+------------------------------v------------------------------+
|                     Edge API Gateway (SSRF Guard)           |
+------------------------------+------------------------------+
                               |
               +---------------+---------------+
               |                               |
+--------------v--------------+ +--------------v--------------+
|   Deterministic Graph Engine| |   Document Vector Store     |
|   (Adjacency & Backlinks)   | |   (HNSW Cache-Aligned Index)|
+-----------------------------+ +-----------------------------+
\`\`\`

## 🔒 Security, RBAC & Invariant Guarantees
- **Data Boundary:** All user content is encrypted at rest using AES-GCM-256 with workspace-isolated keys.
- **Zero-Trust Isolation:** Outbound link scrapers must pass through [[SSRF Safe URL Resolver & IP Range Blocking]].

## 🗺️ Milestone Roadmap & Deliverables
- [ ] **Milestone 1 (Sprint 32):** Implement [[PageRank Graph Centrality Scoring Algorithm]] in WebWorker.
- [ ] **Milestone 2 (Sprint 33):** Deploy full-text keyword indexing across extracted PDF documents.
- [ ] **Milestone 3 (Sprint 34):** End-to-end integration testing and workspace audit telemetry.
`,
  },
  {
    id: 'daily_standup',
    name: 'Daily Standup & Retrospective',
    category: 'daily',
    icon: 'Clock',
    badge: 'Productivity',
    description: 'Rapid daily log for shipped features, blockers, focus targets, and ephemeral thoughts.',
    defaultTitle: `Daily Log: ${new Date().toISOString().split('T')[0]}`,
    defaultTags: ['daily-log', 'standup', 'retrospective'],
    content: `# Daily Log: ${new Date().toISOString().split('T')[0]}

**Workspace:** Engineering Architecture & Vault  
**Primary Focus:** Wikilink indexing and graph visualizer optimizations

---

## 🚀 Shipped & Accomplished Today
- Refactored force-directed graph node placement simulation into memoized geometry.
- Verified bidirectional backlinks resolution for [[Next.js Architecture & High-Performance Pipelines]].
- Triaged 3 items from the capture inbox.

## 🚧 Blockers & Technical Inquiries
- Need clarification from @Elena Rostova on CORS policy for external PDF proxies.
- Investigating potential memory leak when rendering SVG graph nodes with > 500 vertices.

## 🎯 Tomorrow's Priority Targets
- [ ] Complete benchmark report for [[Distributed Locks with Redis & Redlock Algorithm]].
- [ ] Polish context rail citation previews in [[DocumentReader]].
- [ ] Update team wiki on template standards.

## 💡 Epiphanies & Quick Links
- Discovered that pre-allocating Uint32Array for graph adjacency tables reduces GC pauses by 40%.
`,
  },
  {
    id: 'incident_rca',
    name: 'Incident Postmortem & RCA',
    category: 'engineering',
    icon: 'AlertTriangle',
    badge: 'Reliability',
    description: 'Blameless root cause analysis (5 Whys), timeline of events, and remediation tracking.',
    defaultTitle: 'Postmortem: [Incident Summary - YYYY-MM-DD]',
    defaultTags: ['incident', 'postmortem', 'rca', 'reliability'],
    content: `# Postmortem: [Incident Summary]

**Incident Date:** ${new Date().toISOString().split('T')[0]}  
**Severity:** SEV-1 | SEV-2 | SEV-3  
**Lead Incident Commander:** @Elena Rostova  
**Impacted Services:** Search Indexing, Wikilink Ingestion Service

---

## ⏱️ Timeline of Events (UTC)
- **14:02:** Alert triggered on elevated p99 latency on search ingestion pipeline.
- **14:10:** Incident team assembled; identified unbounded recursion in cyclic backlink extractor.
- **14:22:** Applied hotfix patch to add visited node set in [[PageRank Graph Centrality Scoring Algorithm]].
- **14:35:** Latency normalized; all queued ingestion tasks processed without data loss.

## 🔍 Root Cause Analysis (5 Whys)
1. **Why did latency spike?** The backlink parser consumed 100% CPU on deeply nested cycles.
2. **Why was there a cycle?** Two notes linked to each other with identical alias redirects.
3. **Why wasn't the cycle detected?** The parser lacked a recursion depth limiter.
4. **Why was there no depth limiter?** Original implementation assumed acyclic DAG topologies.
5. **Why was DAG assumed?** Initial specifications did not account for mutual cross-citation.

## 🛠️ Preventative Remediation Items
- [ ] **Action 1:** Add unit test suite covering circular wikilink graphs.
- [ ] **Action 2:** Implement watchdog circuit breaker with 50ms execution timeout.
- [ ] **Action 3:** Update architecture guide in [[Zero-Trust & Security]].
`,
  },
  {
    id: 'concept_deepdive',
    name: 'Concept & Algorithmic Deep Dive',
    category: 'research',
    icon: 'Sparkles',
    badge: 'Knowledge',
    description: 'Framework for formal definitions, mathematical intuition, and practical trade-offs.',
    defaultTitle: 'Concept: [Algorithm / Pattern Name]',
    defaultTags: ['concept', 'algorithms', 'deep-dive'],
    content: `# Concept: [Algorithm / Pattern Name]

**Category:** Distributed Algorithms / Graph Theory  
**Related Entities:** [[Graph & Vector Indexing]], [[Systems Architecture]]

---

## 💡 1-Sentence Intuition
A high-level explanation of the concept written so anyone on the team can understand its purpose.

## 📐 Formal Definition & Mathematical Principles
Detailed mathematical formulations, invariants, or state machines.

\`\`\`
State S_{t+1} = f(S_t, \\text{Input}) \\quad \\text{where } \\forall i, j: \\text{Score}(i) \\ge 0
\`\`\`

## ⚖️ Trade-Offs & Complexity Bounds
- **Time Complexity:** $O(V + E)$ for adjacency traversal.
- **Space Complexity:** $O(V)$ auxiliary memory for BFS queue.
- **Pros:** Deterministic reproducibility, low CPU overhead, easily parallelizable.
- **Cons:** Higher initial indexing latency when dataset changes frequently.

## 🔗 Live Implementations & References
- Code implementation: [[PageRank Graph Centrality Scoring Algorithm]]
- Academic paper: [[Efficient and Robust Approximate Nearest Neighbor Using HNSW]]
`,
  },
];
