"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";

import {
  type Proposal,
  type ProposalStatus,
  PROPOSAL_STATUS_LABELS,
} from "@/lib/proposal/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { InlineTextField } from "@/components/primitives/InlineTextField";
import { InlineTextareaField } from "@/components/primitives/InlineTextareaField";
import { InlineFieldRow } from "@/components/primitives/InlineFieldRow";

const STATUS_OPTIONS = Object.keys(
  PROPOSAL_STATUS_LABELS,
) as ProposalStatus[];

const STATUS_BADGE_VARIANT: Record<
  ProposalStatus,
  "default" | "secondary" | "outline"
> = {
  idea: "secondary",
  reviewing: "outline",
  submitted: "default",
};

type EditableProposalKey =
  | "title"
  | "target"
  | "material"
  | "merits"
  | "trendSource"
  | "memo";

type ProposalFormPaneProps = {
  proposal: Proposal | null;
  pane3Open: boolean;
  onClose: () => void;
  onUpdateField: (id: string, field: EditableProposalKey, value: string) => void;
  onUpdateStatus: (id: string, status: ProposalStatus) => void;
  onDeleteProposal: (id: string) => void;
};

export function ProposalFormPane({
  proposal,
  pane3Open,
  onClose,
  onUpdateField,
  onUpdateStatus,
  onDeleteProposal,
}: ProposalFormPaneProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!pane3Open || !proposal) {
    return null;
  }

  return (
    <>
      <section className="flex w-[320px] shrink-0 flex-col border-l border-border bg-background">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-foreground">
              提案フォーム
            </h2>
            <Badge
              variant={STATUS_BADGE_VARIANT[proposal.status]}
              size="xs"
              className="shrink-0"
            >
              {PROPOSAL_STATUS_LABELS[proposal.status]}
            </Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="提案フォームを閉じる"
            className="text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-6 px-4 py-4">
            {/* タイトル */}
            <div className="flex flex-col gap-1.5">
              <SectionLabel>提案タイトル</SectionLabel>
              <InlineTextField
                value={proposal.title}
                onSave={(v) => onUpdateField(proposal.id, "title", v)}
                ariaLabel="提案タイトル"
                placeholder="例: 既存ビル外断熱リノベ向けVIPパッケージ"
              />
            </div>

            <Separator />

            <dl className="flex flex-col gap-4 text-sm">
              <InlineFieldRow label="ターゲット（用途・建物種別）">
                <InlineTextField
                  value={proposal.target}
                  onSave={(v) => onUpdateField(proposal.id, "target", v)}
                  ariaLabel="ターゲット"
                  placeholder="例: 築20年以上のオフィスビル"
                />
              </InlineFieldRow>

              <InlineFieldRow label="採用素材・部材">
                <InlineTextareaField
                  value={proposal.material}
                  onSave={(v) => onUpdateField(proposal.id, "material", v)}
                  ariaLabel="採用素材・部材"
                  placeholder="例: 真空断熱パネル（VIP）＋外壁仕上げ材セット"
                />
              </InlineFieldRow>

              <InlineFieldRow label="提案メリット">
                <InlineTextareaField
                  value={proposal.merits}
                  onSave={(v) => onUpdateField(proposal.id, "merits", v)}
                  ariaLabel="提案メリット"
                  placeholder="例: 壁厚増加を最小限に抑えつつ省エネ基準を達成"
                />
              </InlineFieldRow>

              <InlineFieldRow label="根拠トレンド（参照した収集）">
                <InlineTextField
                  value={proposal.trendSource}
                  onSave={(v) =>
                    onUpdateField(proposal.id, "trendSource", v)
                  }
                  ariaLabel="根拠トレンド"
                  placeholder="例: ZEB 建材（2026年7月第1週収集）"
                />
              </InlineFieldRow>

              <InlineFieldRow label="ステータス">
                <Select
                  value={proposal.status}
                  onValueChange={(v) =>
                    onUpdateStatus(proposal.id, v as ProposalStatus)
                  }
                >
                  <SelectTrigger
                    aria-label="ステータス"
                    className="h-8 w-full bg-card hover:bg-accent/40"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {PROPOSAL_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InlineFieldRow>

              <InlineFieldRow label="備考・メモ">
                <InlineTextareaField
                  value={proposal.memo}
                  onSave={(v) => onUpdateField(proposal.id, "memo", v)}
                  ariaLabel="備考・メモ"
                  placeholder="例: LIXILの施工パートナー制度を確認"
                />
              </InlineFieldRow>
            </dl>

            <Separator />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 aria-hidden="true" />
              この提案を削除
            </Button>
          </div>
        </ScrollArea>
      </section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提案を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{proposal.title || "（タイトル未設定）"}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteProposal(proposal.id);
                setDeleteDialogOpen(false);
              }}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
