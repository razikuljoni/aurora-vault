'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { knowledgeStore } from '@/lib/store';
import {
  Workspace,
  User,
  Note,
  DocumentItem,
  Bookmark,
  CodeSnippet,
  Collection,
  InboxItem,
  Role,
  DocumentHighlight,
  NoteTemplate,
} from '@/lib/types';
import { Header } from '@/components/lumen/Header';
import { Sidebar } from '@/components/lumen/Sidebar';
import { CommandPalette } from '@/components/lumen/CommandPalette';
import { QuickCaptureModal } from '@/components/lumen/QuickCaptureModal';

// Views
import { HomeView } from '@/components/views/HomeView';
import { InboxView } from '@/components/views/InboxView';
import { NotesView } from '@/components/views/NotesView';
import { DocumentsView } from '@/components/views/DocumentsView';
import { BookmarksView } from '@/components/views/BookmarksView';
import { CodeView } from '@/components/views/CodeView';
import { CollectionsView } from '@/components/views/CollectionsView';
import { KnowledgeGraphView } from '@/components/views/KnowledgeGraphView';
import { SearchView } from '@/components/views/SearchView';
import { IntelligenceView } from '@/components/views/IntelligenceView';
import { AuditView } from '@/components/views/AuditView';
import { SettingsView } from '@/components/views/SettingsView';

export default function AuroraVaultPage() {
  // Store state slices
  const [currentUser, setCurrentUser] = useState<User>(() => knowledgeStore.getCurrentUser());
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => knowledgeStore.getWorkspaces());
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(() => knowledgeStore.getWorkspace());
  const [members, setMembers] = useState(() => knowledgeStore.getMembers());
  const [notes, setNotes] = useState<Note[]>(() => knowledgeStore.getNotes());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => knowledgeStore.getDocuments());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => knowledgeStore.getBookmarks());
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>(() => knowledgeStore.getCodeSnippets());
  const [collections, setCollections] = useState<Collection[]>(() => knowledgeStore.getCollections());
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(() => knowledgeStore.getInbox());
  const [activity, setActivity] = useState(() => knowledgeStore.getActivity());
  const [auditLogs, setAuditLogs] = useState(() => knowledgeStore.getAuditLogs());
  const [graphData, setGraphData] = useState(() => knowledgeStore.getGraphData());
  const [insights, setInsights] = useState(() => knowledgeStore.getInsights());

  // Navigation & Active items
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Refresh helper
  const syncStore = useCallback(() => {
    setCurrentWorkspace(knowledgeStore.getWorkspace());
    setWorkspaces(knowledgeStore.getWorkspaces());
    setMembers(knowledgeStore.getMembers());
    setNotes([...knowledgeStore.getNotes()]);
    setDocuments([...knowledgeStore.getDocuments()]);
    setBookmarks([...knowledgeStore.getBookmarks()]);
    setCodeSnippets([...knowledgeStore.getCodeSnippets()]);
    setCollections([...knowledgeStore.getCollections()]);
    setInboxItems([...knowledgeStore.getInbox()]);
    setActivity([...knowledgeStore.getActivity()]);
    setAuditLogs([...knowledgeStore.getAuditLogs()]);
    setGraphData(knowledgeStore.getGraphData());
    setInsights(knowledgeStore.getInsights());
  }, []);

  // Global Keyboard Shortcuts (⌘K for CommandPalette, ⌘⇧Space for QuickCapture)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // ⌘⇧Space
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handler
  const handleNavigate = (view: string, itemId?: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    if (itemId) {
      if (view === 'notes') setSelectedNoteId(itemId);
      if (view === 'documents') setSelectedDocId(itemId);
      if (view === 'collections') setSelectedCollectionId(itemId);
    }
  };

  // Note Actions
  const handleCreateNote = (template?: Partial<Note> | NoteTemplate) => {
    let title = 'Untitled Note';
    let content = '# Untitled Note\n\nStart authoring with [[wikilinks]] and markdown syntax...';
    let tags: string[] = ['research'];

    if (template) {
      if ('defaultTitle' in template) {
        title = template.defaultTitle;
        content = template.content;
        tags = template.defaultTags;
      } else {
        const notePartial = template as Partial<Note>;
        if (notePartial.title) title = notePartial.title;
        if (notePartial.content) content = notePartial.content;
        if (notePartial.tags) tags = notePartial.tags;
      }
    }

    const newNote = knowledgeStore.createNote({
      title,
      content,
      tags,
      collectionId: selectedCollectionId || undefined,
    });
    syncStore();
    setSelectedNoteId(newNote.id);
    setCurrentView('notes');
  };

  const handleSaveNote = (id: string, updates: Partial<Note>) => {
    knowledgeStore.updateNote(id, updates);
    syncStore();
  };

  const handleDeleteNote = (id: string) => {
    knowledgeStore.deleteNote(id);
    syncStore();
    const remaining = knowledgeStore.getNotes();
    setSelectedNoteId(remaining[0]?.id || null);
  };

  const handleTogglePin = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      knowledgeStore.updateNote(id, { pinned: !note.pinned });
      syncStore();
    }
  };

  const handleRestoreVersion = (noteId: string, versionId: string) => {
    knowledgeStore.restoreNoteVersion(noteId, versionId);
    syncStore();
  };

  // Document Actions
  const handleUploadDoc = (data: Partial<DocumentItem>) => {
    const newDoc = knowledgeStore.createDocument(data);
    syncStore();
    setSelectedDocId(newDoc.id);
  };

  const handleAddHighlight = (docId: string, hl: Omit<DocumentHighlight, 'id' | 'createdAt' | 'createdBy'>) => {
    knowledgeStore.addDocumentHighlight(docId, hl);
    syncStore();
  };

  // Bookmark Actions
  const handleAddBookmark = (data: Partial<Bookmark>) => {
    knowledgeStore.createBookmark(data);
    syncStore();
  };

  const handleToggleBookmarkRead = (id: string) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (bm) {
      bm.readStatus = bm.readStatus === 'READ' ? 'UNREAD' : 'READ';
      syncStore();
    }
  };

  const handleDeleteBookmark = (id: string) => {
    knowledgeStore.deleteBookmark(id);
    syncStore();
  };

  // Code Snippet Actions
  const handleAddSnippet = (data: Partial<CodeSnippet>) => {
    knowledgeStore.createCodeSnippet(data);
    syncStore();
  };

  const handleDeleteSnippet = (id: string) => {
    knowledgeStore.deleteCodeSnippet(id);
    syncStore();
  };

  // Collection Actions
  const handleCreateCollection = (data: Partial<Collection>) => {
    knowledgeStore.createCollection(data);
    syncStore();
  };

  // Quick Capture & Inbox Actions
  const handleCapture = (data: { type: any; title: string; content: string; url?: string; tags: string[] }) => {
    knowledgeStore.createInboxItem(data);
    syncStore();
  };

  const handleTriageItem = (itemId: string, destination: 'NOTE' | 'BOOKMARK' | 'CODE', collectionId?: string) => {
    const actionMap = {
      NOTE: 'CONVERT_TO_NOTE' as const,
      BOOKMARK: 'CONVERT_TO_BOOKMARK' as const,
      CODE: 'CONVERT_TO_NOTE' as const,
    };
    knowledgeStore.triageInboxItem(itemId, actionMap[destination]);
    syncStore();
  };

  const handleDeleteInboxItem = (itemId: string) => {
    knowledgeStore.triageInboxItem(itemId, 'ARCHIVE');
    syncStore();
  };

  // Workspace Settings Actions
  const handleUpdateWorkspace = (updates: Partial<Workspace>) => {
    knowledgeStore.updateWorkspace(updates);
    syncStore();
  };

  const handleInviteMember = (email: string, role: Role) => {
    knowledgeStore.inviteMember(email, role);
    syncStore();
  };

  const handleChangeRole = (memberId: string, role: Role) => {
    knowledgeStore.updateMemberRole(memberId, role);
    syncStore();
  };

  const handleRemoveMember = (memberId: string) => {
    knowledgeStore.removeMember(memberId);
    syncStore();
  };

  const handleExportVault = () => {
    const vaultArchive = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      workspace: currentWorkspace,
      notes,
      documents,
      bookmarks,
      codeSnippets,
      collections,
      graph: graphData,
      auditLogs,
    };
    const dataStr = JSON.stringify(vaultArchive, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurora-vault-backup-${currentWorkspace.slug}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCommandPaletteAction = (action: string) => {
    if (action === 'capture') setIsQuickCaptureOpen(true);
    if (action === 'new-note') handleCreateNote();
    if (action === 'export') handleExportVault();
  };

  // Active inbox items count (pending)
  const pendingInboxCount = inboxItems.filter((i) => i.status === 'PENDING').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* App Top Header Bar */}
      <Header
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        currentUser={currentUser}
        onSelectWorkspace={(ws) => {
          knowledgeStore.switchWorkspace(ws.id);
          syncStore();
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace Frame: Sidebar + Active View Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          collections={collections}
          onSelectCollection={(colId) => {
            setSelectedCollectionId(colId);
            setCurrentView('collections');
          }}
          inboxCount={pendingInboxCount}
          workspace={currentWorkspace}
          className={`absolute md:relative z-30 h-full transform transition-transform duration-200 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        />

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 w-full min-w-0">
          {currentView === 'home' && (
            <HomeView
              insights={insights}
              recentNotes={notes.slice(0, 4)}
              recentDocs={documents.slice(0, 3)}
              recentBookmarks={bookmarks.slice(0, 4)}
              collections={collections}
              inboxItems={inboxItems.filter((i) => i.status === 'PENDING')}
              activities={activity}
              onNavigate={handleNavigate}
              onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
              onSelectNote={(noteId) => {
                setSelectedNoteId(noteId);
                setCurrentView('notes');
              }}
              onSelectDoc={(docId) => {
                setSelectedDocId(docId);
                setCurrentView('documents');
              }}
            />
          )}

          {currentView === 'inbox' && (
            <InboxView
              items={inboxItems.filter((i) => i.status === 'PENDING')}
              collections={collections}
              onTriageItem={handleTriageItem}
              onDeleteItem={handleDeleteInboxItem}
              onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            />
          )}

          {currentView === 'notes' && (
            <NotesView
              notes={notes}
              documents={documents}
              collections={collections}
              activeNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              onCreateNote={handleCreateNote}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePin}
              getBacklinks={(noteId) => knowledgeStore.getBacklinksForNote(noteId)}
              getVersions={(noteId) => knowledgeStore.getNoteVersions(noteId)}
              getHighlights={(noteId) => knowledgeStore.getHighlightsForNote(noteId)}
              onRestoreVersion={handleRestoreVersion}
              onOpenDocument={(docId) => {
                setSelectedDocId(docId);
                setCurrentView('documents');
              }}
            />
          )}

          {currentView === 'documents' && (
            <DocumentsView
              documents={documents}
              collections={collections}
              activeDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
              onUploadDoc={handleUploadDoc}
              onAddHighlight={handleAddHighlight}
              onOpenNote={(noteId) => {
                setSelectedNoteId(noteId);
                setCurrentView('notes');
              }}
            />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksView
              bookmarks={bookmarks}
              collections={collections}
              onAddBookmark={handleAddBookmark}
              onToggleRead={handleToggleBookmarkRead}
              onDeleteBookmark={handleDeleteBookmark}
            />
          )}

          {currentView === 'code' && (
            <CodeView
              snippets={codeSnippets}
              collections={collections}
              onAddSnippet={handleAddSnippet}
              onDeleteSnippet={handleDeleteSnippet}
            />
          )}

          {currentView === 'collections' && (
            <CollectionsView
              collections={collections}
              notes={notes}
              documents={documents}
              bookmarks={bookmarks}
              codeSnippets={codeSnippets}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={setSelectedCollectionId}
              onCreateCollection={handleCreateCollection}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'graph' && (
            <KnowledgeGraphView
              graphData={graphData}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              notes={notes}
              documents={documents}
              bookmarks={bookmarks}
              codeSnippets={codeSnippets}
              collections={collections}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'intelligence' && (
            <IntelligenceView
              insights={insights}
              notes={notes}
              documents={documents}
              bookmarks={bookmarks}
              codeSnippets={codeSnippets}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'audit' && (
            <AuditView
              auditLogs={auditLogs}
              activities={activity}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              workspace={currentWorkspace}
              members={members}
              onUpdateWorkspace={handleUpdateWorkspace}
              onInviteMember={handleInviteMember}
              onChangeRole={handleChangeRole}
              onRemoveMember={handleRemoveMember}
              onExportVault={handleExportVault}
            />
          )}
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        notes={notes}
        documents={documents}
        bookmarks={bookmarks}
        codeSnippets={codeSnippets}
        collections={collections}
        onNavigate={handleNavigate}
        onAction={handleCommandPaletteAction}
      />

      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}
