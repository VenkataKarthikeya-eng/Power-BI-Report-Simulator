/**
 * Dashboard Capsule AI — Database Client & Entity Exports
 */

export interface DbStatus {
  connected: boolean;
  engine: string;
  poolSize: number;
  activeConnections: number;
}

export interface UserRecord {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: Date;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  planTier: string;
  createdAt: Date;
}

export interface CapsuleRecord {
  id: string;
  name: string;
  organizationId: string;
  pbixHash: string;
  signature: string;
  createdAt: Date;
}

// Version 2.0 Multi-Agent Database Entity Schemas
export interface AgentSessionRecord {
  id: string;
  organizationId: string;
  dashboardId: string;
  status: string;
  totalAgents: number;
  consensusScore: number;
  createdAt: Date;
}

export interface AgentTaskRecord {
  id: string;
  sessionId: string;
  agentId: string;
  status: string;
  durationMs: number;
  createdAt: Date;
}

export interface AgentMemoryRecord {
  id: string;
  category: string;
  key: string;
  valueJson: string;
  createdAt: Date;
}

export interface AgentMessageRecord {
  id: string;
  sessionId: string;
  agentId: string;
  role: string;
  content: string;
  createdAt: Date;
}

export interface AgentResultRecord {
  id: string;
  taskId: string;
  agentId: string;
  confidenceScore: number;
  findingsJson: string;
  recommendationsJson: string;
  createdAt: Date;
}

export interface AgentMetricRecord {
  id: string;
  sessionId: string;
  totalDurationMs: number;
  memoryMb: number;
  recordedAt: Date;
}

// Version 2.0 Phase 18 Real-Time Collaboration Database Entity Schemas
export interface RealtimeSessionRecord {
  id: string;
  dashboardId: string;
  hostUserId: string;
  status: string; // ACTIVE, CLOSED
  createdAt: Date;
}

export interface RealtimeEventRecord {
  id: string;
  sessionId: string;
  dashboardId: string;
  userId: string;
  eventType: string;
  payloadJson: string;
  timestamp: Date;
}

export interface CommentRecord {
  id: string;
  dashboardId: string;
  userId: string;
  userName: string;
  content: string;
  mentionsJson: string;
  isResolved: boolean;
  createdAt: Date;
}

export interface MentionRecord {
  id: string;
  commentId: string;
  mentionedEmail: string;
  createdAt: Date;
}

export interface PresenceRecord {
  id: string;
  dashboardId: string;
  userId: string;
  status: string;
  cursorX: number;
  cursorY: number;
  updatedAt: Date;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: string;
  isRead: boolean;
  createdAt: Date;
}

// Version 2.0 Phase 19 AI Dashboard Builder Database Entity Schemas
export interface DashboardTemplateRecord {
  id: string;
  domain: string;
  name: string;
  description: string;
  prompt: string;
  createdAt: Date;
}

export interface PromptHistoryRecord {
  id: string;
  userId: string;
  prompt: string;
  domain: string;
  dashboardName: string;
  createdAt: Date;
}

export interface GeneratedDashboardRecord {
  id: string;
  organizationId: string;
  name: string;
  domain: string;
  theme: string;
  kpisJson: string;
  visualsJson: string;
  summaryText: string;
  createdAt: Date;
}

export interface ChartRecommendationRecord {
  id: string;
  dashboardId: string;
  visualType: string;
  title: string;
  fieldsJson: string;
  createdAt: Date;
}

export interface BusinessRuleRecord {
  id: string;
  domain: string;
  ruleKey: string;
  ruleValueJson: string;
  createdAt: Date;
}

// Version 2.0 Phase 20 Predictive Simulation & Digital Twin Database Entity Schemas
export interface DigitalTwinRecord {
  id: string;
  organizationId: string;
  dashboardId: string;
  modelName: string;
  domain: string;
  activeVersionId: string;
  status: string;
  createdAt: Date;
}

export interface SimulationModelRecord {
  id: string;
  digitalTwinId: string;
  name: string;
  parametersJson: string;
  createdAt: Date;
}

export interface SimulationRunRecord {
  id: string;
  digitalTwinId: string;
  runType: string;
  outcomesJson: string;
  executedAt: Date;
}

export interface ForecastResultRecord {
  id: string;
  digitalTwinId: string;
  metricName: string;
  forecastAvg: number;
  timelineJson: string;
  createdAt: Date;
}

export interface ScenarioVersionRecord {
  id: string;
  digitalTwinId: string;
  scenarioName: string;
  parametersJson: string;
  simulatedMetricsJson: string;
  parentVersionId?: string;
  createdAt: Date;
}

export interface ScenarioComparisonRecord {
  id: string;
  digitalTwinId: string;
  baseVersionId: string;
  optimisticVersionId: string;
  stressVersionId: string;
  varianceDeltaPct: number;
  bestOptionName: string;
  recommendationText: string;
  createdAt: Date;
}

export interface DigitalTwinRecommendationRecord {
  id: string;
  digitalTwinId: string;
  title: string;
  impact: string;
  confidenceScore: number;
  description: string;
  createdAt: Date;
}

export interface RiskAssessmentRecord {
  id: string;
  digitalTwinId: string;
  riskCategory: string;
  exposureScore: number;
  mitigationStrategy: string;
  createdAt: Date;
}

// Version 2.0 Phase 21 Autonomous Intelligence Database Entity Schemas
export interface MonitoringRuleRecord {
  id: string;
  dashboardId: string;
  metricName: string;
  condition: string;
  thresholdValue: number;
  severity: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AlertRuleRecord {
  id: string;
  monitoringRuleId: string;
  notificationChannelsJson: string;
  createdAt: Date;
}

export interface AlertRecord {
  id: string;
  dashboardId: string;
  metricName: string;
  title: string;
  description: string;
  severity: string;
  deviationPct: number;
  detectedAt: Date;
}

export interface RecommendationRecord {
  id: string;
  title: string;
  category: string;
  projectedGain: string;
  actionPlanId: string;
  requiresApproval: boolean;
  createdAt: Date;
}

export interface ActionPlanRecord {
  id: string;
  workflowId: string;
  title: string;
  targetDashboardId: string;
  remediationStepsJson: string;
  projectedGain: string;
  status: string;
  approvedBy?: string;
  createdAt: Date;
}

export interface WorkflowDefinitionRecord {
  id: string;
  name: string;
  triggerIfMetric: string;
  triggerCondition: string;
  actionStepsJson: string;
  requireApproval: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface WorkflowExecutionRecord {
  id: string;
  workflowId: string;
  planId: string;
  status: string;
  summaryText: string;
  multiAgentReport: string;
  executedAt: Date;
}

export interface KnowledgeBaseRecord {
  id: string;
  category: string;
  topic: string;
  contentMarkdown: string;
  createdAt: Date;
}

export interface FeedbackHistoryRecord {
  id: string;
  actionPlanId: string;
  userRating: number;
  feedbackText: string;
  createdAt: Date;
}






export class DatabaseClient {
  private isConnected: boolean = true;

  async getStatus(): Promise<DbStatus> {
    return {
      connected: this.isConnected,
      engine: 'PostgreSQL 16 via Prisma ORM / Connection Pool',
      poolSize: 20,
      activeConnections: 3,
    };
  }

  async healthCheck(): Promise<boolean> {
    return this.isConnected;
  }
}

export const db = new DatabaseClient();

export function getDbStatus(): DbStatus {
  return {
    connected: true,
    engine: 'PostgreSQL 16 via Prisma ORM',
    poolSize: 20,
    activeConnections: 3,
  };
}

