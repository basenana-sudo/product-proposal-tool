"use client";

import { useState, useCallback } from "react";

import {
  type Collection,
  type Proposal,
  type ProposalStatus,
  type ProposalData,
} from "@/lib/proposal/schema";
import { CollectionListPane } from "@/components/proposal/CollectionListPane";
import { MaterialPane } from "@/components/proposal/MaterialPane";
import { ProposalFormPane } from "@/components/proposal/ProposalFormPane";

type EditableProposalKey =
  | "title"
  | "target"
  | "material"
  | "merits"
  | "trendSource"
  | "memo";

type ProposalWorkspaceProps = {
  initialData: ProposalData;
};

export function ProposalWorkspace({ initialData }: ProposalWorkspaceProps) {
  const [collections, setCollections] = useState<Collection[]>(
    initialData.collections,
  );
  const [proposals, setProposals] = useState<Proposal[]>(
    initialData.proposals,
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(initialData.collections[0]?.id ?? null);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    initialData.proposals[0]?.id ?? null,
  );
  const [pane3ManuallyClosed, setPane3ManuallyClosed] = useState(false);

  const pane3Open = selectedProposalId !== null && !pane3ManuallyClosed;

  const selectedCollection =
    collections.find((c) => c.id === selectedCollectionId) ?? null;
  const selectedProposal =
    proposals.find((p) => p.id === selectedProposalId) ?? null;

  // ── 収集操作 ──────────────────────────────────────
  const selectCollection = useCallback((id: string) => {
    setSelectedCollectionId(id);
    setSelectedProposalId(null);
    setPane3ManuallyClosed(false);
  }, []);

  const addCollection = useCallback((weekLabel: string) => {
    const newId = `col-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    const newCollection: Collection = {
      id: newId,
      weekLabel,
      content: "",
      createdAt: today,
    };
    setCollections((prev) => [newCollection, ...prev]);
    setSelectedCollectionId(newId);
    setSelectedProposalId(null);
    setPane3ManuallyClosed(false);
  }, []);

  const updateCollectionContent = useCallback(
    (collectionId: string, content: string) => {
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, content } : c)),
      );
    },
    [],
  );

  const deleteCollection = useCallback(
    (collectionId: string) => {
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
      setProposals((prev) =>
        prev.filter((p) => p.collectionId !== collectionId),
      );
      setSelectedCollectionId((prev) => {
        if (prev !== collectionId) return prev;
        const remaining = collections.filter((c) => c.id !== collectionId);
        return remaining[0]?.id ?? null;
      });
      setSelectedProposalId((prev) => {
        const linked = proposals.find(
          (p) => p.id === prev && p.collectionId === collectionId,
        );
        return linked ? null : prev;
      });
    },
    [collections, proposals],
  );

  // ── 提案操作 ──────────────────────────────────────
  const selectProposal = useCallback((id: string) => {
    setSelectedProposalId(id);
    setPane3ManuallyClosed(false);
  }, []);

  const addProposal = useCallback(
    (collectionId: string) => {
      const newId = `prop-${Date.now()}`;
      const collection = collections.find((c) => c.id === collectionId);
      const newProposal: Proposal = {
        id: newId,
        collectionId,
        title: "",
        target: "",
        material: "",
        merits: "",
        trendSource: collection ? `${collection.weekLabel}収集` : "",
        status: "idea",
        memo: "",
      };
      setProposals((prev) => [...prev, newProposal]);
      setSelectedProposalId(newId);
      setPane3ManuallyClosed(false);
    },
    [collections],
  );

  const updateProposalField = useCallback(
    (id: string, field: EditableProposalKey, value: string) => {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      );
    },
    [],
  );

  const updateProposalStatus = useCallback(
    (id: string, status: ProposalStatus) => {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p)),
      );
    },
    [],
  );

  const deleteProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    setSelectedProposalId((prev) => (prev === id ? null : prev));
  }, []);

  const closePane3 = useCallback(
    () => setPane3ManuallyClosed(true),
    [],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* グローバルヘッダー */}
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <h1 className="text-sm font-semibold text-foreground">
            建材新商品提案ツール
          </h1>
        </header>

        {/* 3ペイン */}
        <div className="flex min-h-0 flex-1">
          <CollectionListPane
            collections={collections}
            proposals={proposals}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={selectCollection}
            onAddCollection={addCollection}
            onDeleteCollection={deleteCollection}
          />
          <MaterialPane
            collection={selectedCollection}
            proposals={proposals}
            selectedProposalId={selectedProposalId}
            onUpdateContent={updateCollectionContent}
            onAddProposal={addProposal}
            onSelectProposal={selectProposal}
          />
          <ProposalFormPane
            proposal={pane3Open ? selectedProposal : null}
            pane3Open={pane3Open}
            onClose={closePane3}
            onUpdateField={updateProposalField}
            onUpdateStatus={updateProposalStatus}
            onDeleteProposal={deleteProposal}
          />
        </div>
      </div>
    </div>
  );
}
