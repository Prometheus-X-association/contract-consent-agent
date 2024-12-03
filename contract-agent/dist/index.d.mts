import { Router } from 'express';
import { EventEmitter } from 'events';
import { Document, WithId } from 'mongodb';

declare const router$1: Router;

declare const router: Router;

type DataProviderType = {
    new (...args: any[]): DataProvider;
};
declare abstract class DataProvider extends EventEmitter {
    dataSource: string;
    static childType?: DataProviderType;
    constructor(dataSource: string);
    abstract find(criteria: SearchCriteria): Promise<[]>;
    abstract create(data: unknown): Promise<unknown>;
    abstract delete(id: string): Promise<boolean>;
    static setChildType(childType: DataProviderType): void;
    createInstance(): DataProvider;
    ensureReady(): Promise<void>;
    protected abstract makeQuery(conditions: FilterCondition[]): Record<string, any>;
    protected notifyDataChange(eventName: string, data: any): void;
}

interface ProfilePolicy {
    policy: string;
    frequency: number;
}
interface ProfilePreference {
    policies: ProfilePolicy[];
    ecosystems: string[];
    services: string[];
}
interface ProfileRecommendation {
    policies: ProfilePolicy[];
    ecosystemContracts: any[];
    services: any[];
}
interface ProfileMatching {
    policies: ProfilePolicy[];
    ecosystemContracts: any[];
    services: any[];
}
interface ProfileConfigurations {
    allowRecommendation: boolean;
    allowPolicies: boolean;
}
interface SearchCriteria {
    conditions: FilterCondition[];
    threshold: number;
    limit?: number;
}
interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value: any;
}
declare enum FilterOperator {
    IN = "IN",
    EQUALS = "EQUALS",
    GT = "GT",
    LT = "LT",
    CONTAINS = "CONTAINS",
    REGEX = "REGEX"
}
interface Provider {
    source?: string;
    watchChanges?: boolean;
    provider: DataProvider;
    hostsProfiles?: boolean;
}
interface DataProviderConfig {
    source: string;
    url: string;
    dbName: string;
    watchChanges?: boolean;
    hostsProfiles?: boolean;
}
interface ProfileDocument {
    url: string;
    configurations: any;
    recommendations?: any[];
    matching?: any[];
    preference?: any[];
}
type DataChangeEvent = {
    source: string;
    type: 'insert' | 'update' | 'delete';
    documentKey?: {
        _id: string;
    };
    fullDocument?: unknown;
    updateDescription?: {
        updatedFields: unknown;
        removedFields?: string[];
    };
};

type ProfileJSON = Omit<Pick<Profile, keyof Profile>, 'createdAt' | 'updatedAt'> & {
    createdAt?: string | Date;
    updatedAt?: string | Date;
};
declare class Profile {
    _id?: string;
    url: string;
    configurations: ProfileConfigurations;
    recommendations: ProfileRecommendation[];
    matching: ProfileMatching[];
    preference: ProfilePreference[];
    constructor({ url, configurations, recommendations, matching, preference, }: ProfileJSON);
}

interface AgentConfig {
    dataProviderConfig: DataProviderConfig[];
}
declare abstract class Agent {
    private static configPath;
    private static profilesHost;
    protected config?: AgentConfig;
    protected dataProviders: Provider[];
    protected constructor();
    static setProfilesHost(profilesHost: string): void;
    static getProfileHost(): string;
    static setConfigPath(configPath: string, callerFilePath: string): void;
    protected setupProviderEventHandlers(): void;
    getDataProvider(source: string): DataProvider;
    protected abstract handleDataInserted(data: DataChangeEvent): Promise<void>;
    protected abstract handleDataUpdated(data: DataChangeEvent): Promise<void>;
    protected abstract handleDataDeleted(data: DataChangeEvent): void;
    abstract findProfiles(source: string, criteria: SearchCriteria): Promise<Profile[]>;
    addDataProviders(dataProviders: Provider[]): void;
    protected addDefaultProviders(): Promise<void>;
    protected loadDefaultConfiguration(): void;
    getRecommendations(profile: Profile): ProfileRecommendation[];
    getMatchings(profile: Profile): ProfileMatching[];
    protected createProfileForParticipant(participantId: string): Promise<Profile>;
    protected abstract updateMatchingForProfile(profile: Profile, data: unknown): Promise<void>;
    protected abstract updateRecommendationForProfile(profile: Profile, data: unknown): Promise<void>;
    protected abstract enrichProfileWithSystemRecommendations(): Profile;
    protected abstract buildSearchCriteria(sourceEntity: unknown): SearchCriteria;
}

interface Participant {
    participant: string;
    role: string;
    signature: string;
    date: string;
}
interface Policy {
    description: string;
    permission: {
        action: string;
        target: string;
        constraint: {
            leftOperand: string;
            operator: string;
            rightOperand: number | string;
        }[];
    }[];
    prohibition: any[];
}
interface ServiceOffering {
    participant: string;
    serviceOffering: string;
    policies: Policy[];
    _id?: string;
}
type ContractJSON = Omit<Pick<Contract, keyof Contract>, 'createdAt' | 'updatedAt'> & {
    createdAt: string | Date;
    updatedAt: string | Date;
};
declare class Contract {
    _id?: string;
    createdAt: Date;
    updatedAt: Date;
    ecosystem: string;
    members: Participant[];
    orchestrator: string;
    purpose: string[];
    revokedMembers: Participant[];
    rolesAndObligations: any[];
    serviceOfferings: ServiceOffering[];
    status: string;
    constructor({ createdAt, updatedAt, ecosystem, members, orchestrator, purpose, revokedMembers, rolesAndObligations, serviceOfferings, status, _id, }: ContractJSON);
}

/**
 * ContractAgent class handles contract-related operations and profile management
 * @extends Agent
 */
declare class ContractAgent extends Agent {
    private static instance;
    private constructor();
    /**
     * Prepares the ContractAgent instance by loading configuration and setting up providers
     * @throws {ContractAgentError} If preparation fails
     */
    prepare(): Promise<void>;
    /**
     * Retrieves or creates a ContractAgent instance
     * @param dataProviderType - Type of data provider to use
     * @param refresh - Whether to force create a new instance
     * @returns Promise<ContractAgent>
     */
    static retrieveService(dataProviderType?: DataProviderType, refresh?: boolean): Promise<ContractAgent>;
    /**
     * Enriches a profile with system recommendations
     * @throws {ContractAgentError} Method not implemented
     */
    protected enrichProfileWithSystemRecommendations(): Profile;
    /**
     * Builds search criteria based on contract policies
     * @param contract - Contract instance to extract policies from
     * @returns SearchCriteria
     */
    protected buildSearchCriteria(contract: Contract): SearchCriteria;
    /**
     * Finds profiles based on given criteria from a specific source
     * @param source - Data source identifier
     * @param criteria - Search criteria
     * @returns Promise<Profile[]>
     */
    findProfiles(source: string, criteria: SearchCriteria): Promise<Profile[]>;
    /**
     * Finds profiles across all configured providers
     * @param criteria - Search criteria
     * @returns Promise<Profile[]>
     */
    findProfilesAcrossProviders(criteria: SearchCriteria): Promise<Profile[]>;
    /**
     * Updates profiles based on contract changes
     * @param contract - Contract instance
     * @returns Promise<void>
     */
    private updateProfileFromContractChange;
    /**
     * Updates profiles for all contract members
     * @param contract - Contract instance
     */
    private updateProfilesForMembers;
    /**
     * Updates profiles for all service offerings
     * @param contract - Contract instance
     */
    private updateProfilesForServiceOfferings;
    /**
     * Updates profile for contract orchestrator
     * @param contract - Contract instance
     */
    private updateProfileForOrchestrator;
    /**
     * Updates a single profile
     * @param participantId - Participant identifier
     * @param contract - Contract instance
     */
    private updateProfile;
    /**
     * Handles inserted data events
     * @param data - Data change event
     */
    protected handleDataInserted(data: DataChangeEvent): Promise<void>;
    /**
     * Handles updated data events
     * @param data - Data change event
     */
    protected handleDataUpdated(data: DataChangeEvent): Promise<void>;
    /**
     * Handles deleted data events
     * @param data - Data change event
     */
    protected handleDataDeleted(data: DataChangeEvent): void;
    /**
     * Updates matching information for a profile
     * @param profile - Profile instance
     * @param data - Matching data
     */
    protected updateMatchingForProfile(profile: Profile, data: unknown): Promise<void>;
    /**
     * Updates recommendations for a profile
     * @param profile - Profile instance
     * @param data - Recommendation data
     */
    protected updateRecommendationForProfile(profile: Profile, data: unknown): Promise<void>;
}

declare class MongoDBProvider extends DataProvider {
    private static connections;
    private db?;
    private client?;
    private collection;
    private dbName;
    private connectionPromise?;
    constructor(config: DataProviderConfig);
    private connectToDatabase;
    static disconnectFromDatabase(url: string, dbName: string): Promise<void>;
    ensureReady(): Promise<void>;
    private static createCollectionProxy;
    private setupCallbacks;
    protected makeQuery(conditions: FilterCondition[]): Record<string, any>;
    create(data: Document): Promise<WithId<Document>>;
    delete(id: string): Promise<boolean>;
    find(criteria: SearchCriteria): Promise<[]>;
}

export { ContractAgent, router as ContractAgentRouter, type DataProviderConfig, type FilterCondition, MongoDBProvider, router$1 as NegotiationAgentRouter, Profile, type ProfileConfigurations, type ProfileDocument, type ProfileMatching, type ProfilePolicy, type ProfilePreference, type ProfileRecommendation, type Provider, type SearchCriteria };
