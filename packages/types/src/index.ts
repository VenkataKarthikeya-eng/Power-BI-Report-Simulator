/**
 * Dashboard Capsule AI — Enterprise Auth, Org, System, AST, Validation, Optimization, Capsule, Viewer, Copilot, Sharing, Analytics, Health, Admin & Plugin SDK Types
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'DEVELOPER'
  | 'BUSINESS_ANALYST'
  | 'VIEWER'
  | 'HR'
  | 'GUEST'
  | 'EXTERNAL_USER';

export type BIToolProviderType =
  | 'POWER_BI'
  | 'TABLEAU'
  | 'LOOKER'
  | 'QLIK_SENSE'
  | 'APACHE_SUPERSET'
  | 'METABASE'
  | 'AMAZON_QUICKSIGHT'
  | 'SAP_ANALYTICS';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  category: 'CUSTOM_VISUAL' | 'BI_ADAPTER' | 'AI_PROVIDER' | 'INTEGRATION' | 'VALIDATION_RULE';
  author: string;
  description: string;
  rating: number;
  installCount: number;
  isInstalled: boolean;
}

export interface WebhookSubscription {
  id: string;
  targetUrl: string;
  events: Array<'capsule.built' | 'share.created' | 'health.alert' | 'validation.failed'>;
  secretToken: string;
  isActive: boolean;
  createdAt: string;
}

export interface OAuthClientApp {
  id: string;
  appName: string;
  clientId: string;
  redirectUris: string[];
  scope: string;
  createdAt: string;
}

// Capsule Manifest Specification
export interface CapsuleManifest {
  magicHeader: 'DCAPSv1';
  specVersion: '1.0.0';
  biToolAdapter: BIToolProviderType;
  capsuleId: string;
  dashboardName: string;
  fileSizeBytes: number;
  compiledAt: string;
}

// AST & Parsed Metadata Types
export interface VisualAST {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  title?: string;
  fields: string[];
}

export interface PageAST {
  id: string;
  name: string;
  displayName: string;
  ordinal: number;
  width: number;
  height: number;
  visuals: VisualAST[];
}

export interface DashboardAST {
  id: string;
  name: string;
  pbixFingerprintSha256: string;
  fileSizeBytes: number;
  pages: PageAST[];
  parsedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Version 2.0 Enterprise Multi-Agent AI Platform Types
export type AgentCapability =
  | 'structure_analysis'
  | 'dax_optimization'
  | 'schema_review'
  | 'ux_accessibility'
  | 'security_audit'
  | 'performance_review'
  | 'executive_summary'
  | 'documentation'
  | 'testing_validation'
  | 'swarm_coordination';

export interface AgentManifest {
  id: string;
  name: string;
  role: string;
  description: string;
  version: string;
  capabilities: AgentCapability[];
  requiredRole: UserRole;
  priority: number;
}

export interface AgentExecutionResult {
  agentId: string;
  agentName: string;
  status: 'COMPLETED' | 'FAILED' | 'SKIPPED';
  confidenceScore: number;
  findings: Record<string, unknown>[];
  recommendations: string[];
  executionTimeMs: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface SwarmExecutionReport {
  sessionId: string;
  dashboardId: string;
  status: 'COMPLETED' | 'PARTIAL_FAILURE' | 'FAILED';
  totalAgentsRun: number;
  consensusScore: number;
  averageConfidence: number;
  agentResults: AgentExecutionResult[];
  unifiedSummary: string;
  totalDurationMs: number;
  executedAt: string;
}

// Version 2.0 Phase 18 Real-Time Collaboration & Live Streaming Types
export interface RealtimePresenceUser {
  userId: string;
  userName: string;
  avatarUrl: string;
  role: string;
  pageId: string;
  cursorX: number;
  cursorY: number;
  status: 'ONLINE' | 'IDLE' | 'PRESENTING';
  joinedAt: string;
}

export interface RealtimeComment {
  id: string;
  dashboardId: string;
  userId: string;
  userName: string;
  content: string;
  mentions?: string[];
  isResolved: boolean;
  createdAt: string;
}

export interface RealtimeNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'comment' | 'mention' | 'share' | 'ai_analysis' | 'replay';
  isRead: boolean;
  createdAt: string;
}

// Version 2.0 Phase 19 AI Dashboard Builder Types
export type BusinessDomain =
  | 'SALES'
  | 'FINANCE'
  | 'MARKETING'
  | 'HR'
  | 'OPERATIONS'
  | 'SUPPLY_CHAIN'
  | 'MANUFACTURING'
  | 'RETAIL'
  | 'HEALTHCARE'
  | 'CUSTOM';

export interface DashboardTemplate {
  id: string;
  domain: BusinessDomain;
  name: string;
  description: string;
  prompt: string;
}

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  domain: BusinessDomain;
  dashboardName: string;
  generatedAt: string;
}

export interface GeneratedKPI {
  name: string;
  tableName: string;
  expressionDax: string;
  formatString: string;
  description: string;
  improvementGain: number;
}

export interface ChartRecommendation {
  id: string;
  visualType: string;
  title: string;
  fields: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface GeneratedDashboardAST {
  id: string;
  name: string;
  domain: BusinessDomain;
  theme: string;
  pageTitle: string;
  width: number;
  height: number;
  kpis: GeneratedKPI[];
  visualContainers: ChartRecommendation[];
  executiveSummary: string;
  multiAgentConsensus: number;
  generatedAt: string;
}

// Version 2.0 Phase 20 Predictive Simulation & Digital Twin Types
export interface ScenarioVersion {
  versionId: string;
  scenarioName: string;
  parameters: Record<string, number>;
  simulatedMetrics: Record<string, number>;
  parentVersionId?: string;
  createdAt: string;
}

export interface MonteCarloQuantiles {
  p10: number;
  p50: number;
  p90: number;
}

export interface MonteCarloResult {
  simId: string;
  iterations: number;
  meanOutcome: number;
  stdDeviation: number;
  quantiles: MonteCarloQuantiles;
  histogramBins: Record<string, number>;
  riskScore: number;
  executedAt: string;
}

export interface ForecastPoint {
  period: string;
  historical?: number;
  forecasted: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface ForecastResult {
  metricName: string;
  domain: string;
  unit: string;
  historicalAvg: number;
  forecastAvg: number;
  growthRatePct: number;
  timeline: ForecastPoint[];
  generatedAt: string;
}

export interface DigitalTwinModel {
  digitalTwinId: string;
  dashboardId: string;
  modelName: string;
  domain: string;
  activeVersion: string;
  status: 'SYNCED' | 'SIMULATING' | 'OUT_OF_SYNC';
  createdAt: string;
}

// Version 2.0 Phase 21 Autonomous Enterprise Intelligence Types
export interface MonitoringRule {
  ruleId: string;
  dashboardId: string;
  metricName: string;
  condition: string;
  thresholdValue: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  isActive: boolean;
}

export interface IntelligenceAlert {
  alertId: string;
  ruleId: string;
  dashboardId: string;
  metricName: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  deviationPct: number;
  detectedAt: string;
}

export interface ActionPlan {
  planId: string;
  workflowId: string;
  title: string;
  targetDashboardId: string;
  remediationSteps: string[];
  projectedGain: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  approvedBy?: string;
  createdAt: string;
}

export interface WorkflowExecution {
  executionId: string;
  workflowId: string;
  planId: string;
  status: 'SUCCESS' | 'FAILED';
  summaryText: string;
  multiAgentReport: string;
  executedAt: string;
}





