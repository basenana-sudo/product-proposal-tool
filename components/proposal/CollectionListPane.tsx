"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { type Collection, type Proposal } from "@/lib/proposal/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CollectionListPaneProps = {
  collections: Collection[];
  proposals: Proposal[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string) => void;
  onAddCollection: (weekLabel: string) => void;
  onDeleteCollection: (id: string) => void;
};

export function CollectionListPane({
  collections,
  proposals,
  selectedCollectionId,
  onSelectCollection,
  onAddCollection,
  onDeleteCollection,
}: CollectionListPaneProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    weekLabel: string;
  } | null>(null);

  const proposalCountFor = (collectionId: string) =>
    proposals.filter((p) => p.collectionId === collectionId).length;

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    onAddCollection(trimmed);
    setNewLabel("");
    setAddDialogOpen(false);
  };

  return (
    <>
      <section className="flex w-[220px] shrink-0 flex-col border-r border-border bg-background">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <h2 className="truncate text-sm font-semibold text-foreground">
            収集記録
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setAddDialogOpen(true)}
            aria-label="新しい収集を追加"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus aria-hidden="true" />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                収集記録がありません
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus aria-hidden="true" />
                最初の収集を追加
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-1 px-2 py-3">
              {collections.map((col) => {
                const selected = col.id === selectedCollectionId;
                const count = proposalCountFor(col.id);
                return (
                  <CollectionRow
                    key={col.id}
                    collection={col}
                    proposalCount={count}
                    selected={selected}
                    onSelect={() => onSelectCollection(col.id)}
                    onDeleteRequest={() =>
                      setDeleteTarget({
                        id: col.id,
                        weekLabel: col.weekLabel,
                      })
                    }
                  />
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </section>

      {/* 追加ダイアログ */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={(v) => {
          setAddDialogOpen(v);
          if (!v) setNewLabel("");
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>収集を追加</DialogTitle>
            <DialogDescription>新しい週次収集を追加します</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="week-label">週ラベル</FieldLabel>
              <Input
                id="week-label"
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                placeholder="例: 2026年7月第2週"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">キャンセル</Button>} />
            <Button onClick={handleAdd} disabled={!newLabel.trim()}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>収集を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.weekLabel}」を削除します。この収集に紐づく提案も一緒に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  onDeleteCollection(deleteTarget.id);
                  setDeleteTarget(null);
                }
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

function CollectionRow({
  collection,
  proposalCount,
  selected,
  onSelect,
  onDeleteRequest,
}: {
  collection: Collection;
  proposalCount: number;
  selected: boolean;
  onSelect: () => void;
  onDeleteRequest: () => void;
}) {
  const preview = collection.content
    .replace(/■[^\n]*/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return (
    <li className="group/collection relative">
      <button
        type="button"
        onClick={onSelect}
        className={[
          "flex w-full flex-col gap-1 rounded-md px-2.5 py-2.5 text-left transition-colors",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          selected
            ? "bg-accent text-accent-foreground"
            : "text-foreground hover:bg-muted",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {collection.weekLabel}
          </span>
          {proposalCount > 0 && (
            <Badge variant="secondary" size="xs" className="shrink-0">
              {proposalCount}件
            </Badge>
          )}
        </div>
        {preview && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {preview}
          </p>
        )}
        <time
          dateTime={collection.createdAt}
          className="text-xs text-muted-foreground/70"
        >
          {collection.createdAt}
        </time>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={[
                "absolute top-2 right-1",
                "opacity-0 group-focus-within/collection:opacity-100 group-hover/collection:opacity-100",
                "transition-opacity text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-label={`${collection.weekLabel} の操作`}
            >
              <MoreHorizontal />
            </Button>
          }
        />
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onSelect={onDeleteRequest}>
              <Trash2 />
              削除
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
