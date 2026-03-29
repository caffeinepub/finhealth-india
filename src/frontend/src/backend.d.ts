import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Portfolio = string;
export type Transactions = string;
export interface UserProfile {
    name: string;
    onboardingComplete: boolean;
    income: bigint;
    goals: Array<string>;
    riskProfile: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinHealthScore(): Promise<bigint>;
    getPortfolio(): Promise<Portfolio>;
    getReferralCode(): Promise<string>;
    getReferralCount(user: Principal): Promise<bigint>;
    getTransactions(): Promise<Transactions>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFinHealthScore(newScore: bigint): Promise<void>;
    savePortfolio(newPortfolio: Portfolio): Promise<void>;
    saveTransactions(newTransactions: Transactions): Promise<void>;
    useReferralCode(referredBy: Principal): Promise<void>;
}
