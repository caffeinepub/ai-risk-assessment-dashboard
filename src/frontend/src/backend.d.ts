import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MetricScore {
    value: number;
    risk: RiskLevel;
}
export interface Assessment {
    id: bigint;
    age: bigint;
    bmi: number;
    glucoseScore: MetricScore;
    diastolicBPScore: MetricScore;
    systolicBP: bigint;
    systolicBPScore: MetricScore;
    diastolicBP: bigint;
    glucose: bigint;
    overallRisk: RiskLevel;
    bmiScore: MetricScore;
    timestamp: bigint;
    patientName: string;
    ageScore: MetricScore;
}
export enum RiskLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    deleteAssessment(id: bigint): Promise<void>;
    getAllAssessments(): Promise<Array<Assessment>>;
    getAssessment(id: bigint): Promise<Assessment>;
    getRiskLevelCounts(): Promise<{
        low: bigint;
        high: bigint;
        medium: bigint;
    }>;
    submitAssessment(patientName: string, age: bigint, bmi: number, systolicBP: bigint, diastolicBP: bigint, glucose: bigint): Promise<Assessment>;
}
