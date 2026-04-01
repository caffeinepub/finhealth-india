import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface ChatResponse {
    action?: string;
    reply: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
    plan: PlanType;
    onboardingComplete: boolean;
    income: bigint;
    goals: Array<string>;
    riskProfile: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum PlanType {
    pro = "pro",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    handleStripeWebhook(sessionId: string, userId: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    /**
     * / Send chat message using cached data.
     */
    processChat(message: string): Promise<ChatResponse>;
    /**
     * / Store the given profile to persistent storage.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Store the given FinHealthScore to persistent storage.
     */
    saveFinHealthScore(score: bigint): Promise<void>;
    /**
     * / Store the given portfolio to persistent storage.
     */
    savePortfolio(portfolio: string): Promise<void>;
    /**
     * / Store the given transactions to persistent storage.
     */
    saveTransactions(transactionList: string): Promise<void>;
    setAIApiKey(key: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
