import { z } from "zod";

export const collectionSchema = z.object({
  id: z.string(),
  weekLabel: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const proposalStatusSchema = z.enum(["idea", "reviewing", "submitted"]);

export const proposalSchema = z.object({
  id: z.string(),
  collectionId: z.string().nullable(),
  title: z.string(),
  target: z.string(),
  material: z.string(),
  merits: z.string(),
  trendSource: z.string(),
  status: proposalStatusSchema,
  memo: z.string(),
});

export const proposalDataSchema = z.object({
  collections: z.array(collectionSchema),
  proposals: z.array(proposalSchema),
});

export type Collection = z.infer<typeof collectionSchema>;
export type ProposalStatus = z.infer<typeof proposalStatusSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalData = z.infer<typeof proposalDataSchema>;

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  idea: "アイデア",
  reviewing: "検討中",
  submitted: "提案済み",
};
