"use client";

import { Plus } from "lucide-react";

import {
  type Collection,
  type Proposal,
  type ProposalStatus,
  PROPOSAL_STATUS_LABELS,
} from "@/lib/proposal/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { InlineTextareaField } from "@/components/primitives/InlineTextareaField";

const STATUS_BADGE_VARIANT: Record<
  ProposalStatus,
  "default" | "secondary" | "outline"
> = {
  idea: "secondary",
  reviewing: "outline",
  submitted: "default",
};

type MaterialPaneProps = {
  collection: Collection | null;
  proposals: Proposal[];
  selectedProposalId: string | null;
  onUpdateContent: (collectionId: string, content: string) => void;
  onAddProposal: (collectionId: string) => void;
  onSelectProposal: (id: string) => void;
};

export function MaterialPane({
  collection,
  proposals,
  selectedProposalId,
  onUpdateContent,
  onAddProposal,
  onSelectProposal,
}: MaterialPaneProps) {
  if (!collection) {
    return (
      <section className="flex min-w-0 flex-1 flex-col bg-canvas">
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm font-medium text-foreground">
            収集記録を選択してください
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            左のリストから週次収集を選ぶか、「＋」ボタンで新しい収集を追加してください。
          </p>
        </div>
      </section>
    );
  }

  const linkedProposals = proposals.filter(
    (p) => p.collectionId === collection.id,
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-border bg-canvas">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="truncate text-sm font-semibold text-foreground">
          {collection.weekLabel}
        </h2>
        <time
          dateTime={collection.createdAt}
          className="shrink-0 text-xs text-muted-foreground"
        >
          {collection.createdAt}
        </time>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-5 px-4 py-4">
          {/* AI 整理テキスト貼り付けエリア */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <SectionLabel>AI 整理テキスト</SectionLabel>
              <span className="text-xs text-muted-foreground">
                Cmd+Enter で保存
              </span>
            </div>
            <InlineTextareaField
              value={collection.content}
              onSave={(v) => onUpdateContent(collection.id, v)}
              ariaLabel="AI 整理テキスト"
              placeholder={
                "ここにAIが整理したテキストを貼り付けてください。\n\n例:\n■ 市場トレンド\n...\n■ 注目素材・材料\n...\n■ 組み合わせヒント\n..."
              }
            />
          </div>

          <Separator />

          {/* 提案リスト */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <SectionLabel>この収集から生まれた提案</SectionLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onAddProposal(collection.id)}
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus aria-hidden="true" />
                提案を追加
              </Button>
            </div>

            {linkedProposals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  まだ提案がありません
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddProposal(collection.id)}
                  className="mt-3 h-7 text-xs"
                >
                  <Plus aria-hidden="true" />
                  提案を追加
                </Button>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {linkedProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    selected={proposal.id === selectedProposalId}
                    onSelect={() => onSelectProposal(proposal.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}

function ProposalCard({
  proposal,
  selected,
  onSelect,
}: {
  proposal: Proposal;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={[
          "flex w-full flex-col gap-1.5 rounded-lg border px-3 py-3 text-left transition-colors",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          selected
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-card hover:border-border/80 hover:bg-card/80",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium leading-snug">
            {proposal.title || "（タイトル未設定）"}
          </span>
          <Badge
            variant={STATUS_BADGE_VARIANT[proposal.status]}
            size="xs"
            className="shrink-0"
          >
            {PROPOSAL_STATUS_LABELS[proposal.status]}
          </Badge>
        </div>
        {proposal.target && (
          <p className="text-xs text-muted-foreground">{proposal.target}</p>
        )}
      </button>
    </li>
  );
}
