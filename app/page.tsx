import { ProposalWorkspace } from "@/components/proposal/ProposalWorkspace";
import proposalData from "@/data/proposal.json";
import { proposalDataSchema } from "@/lib/proposal/schema";

export default function Page() {
  const result = proposalDataSchema.safeParse(proposalData);

  if (!result.success) {
    throw new Error(
      `proposal.json のデータが不正です: ${result.error.issues[0]?.message}`,
    );
  }

  return <ProposalWorkspace initialData={result.data} />;
}
