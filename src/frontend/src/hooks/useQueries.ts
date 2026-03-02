import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Assessment } from "../backend.d";
import { RiskLevel } from "../backend.d";
import { useActor } from "./useActor";

export { RiskLevel };
export type { Assessment };

export function useGetAllAssessments() {
  const { actor, isFetching } = useActor();
  return useQuery<Assessment[]>({
    queryKey: ["assessments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssessments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRiskLevelCounts() {
  const { actor, isFetching } = useActor();
  return useQuery<{ low: bigint; high: bigint; medium: bigint }>({
    queryKey: ["riskLevelCounts"],
    queryFn: async () => {
      if (!actor) return { low: 0n, high: 0n, medium: 0n };
      return actor.getRiskLevelCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      patientName: string;
      age: bigint;
      bmi: number;
      systolicBP: bigint;
      diastolicBP: bigint;
      glucose: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitAssessment(
        params.patientName,
        params.age,
        params.bmi,
        params.systolicBP,
        params.diastolicBP,
        params.glucose,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["riskLevelCounts"] });
    },
  });
}

export function useDeleteAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAssessment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["riskLevelCounts"] });
    },
  });
}
