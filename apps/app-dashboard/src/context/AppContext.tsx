'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@dcaps/ui';

export interface Workspace {
  id: string;
  name: string;
  type: string;
  description: string;
  membersCount: number;
  capsulesCount: number;
}

export interface CapsuleItem {
  id: string;
  name: string;
  version: string;
  size: string;
  hash: string;
  signature: string;
  status: 'PUBLISHED' | 'ENCRYPTED' | 'DRAFT';
  healthScore: number;
  savings: string;
  createdAt: string;
}

export interface UserJourneyState {
  workspaceCreated: boolean;
  reportUploaded: boolean;
  aiAnalyzed: boolean;
  optimized: boolean;
  shared: boolean;
}

export interface RecommendedAction {
  title: string;
  explanation: string;
  actionLabel: string;
  route: string;
}

interface AppContextType {
  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  createWorkspace: (name: string, description: string, department: string) => void;

  // Capsules
  capsules: CapsuleItem[];
  addCapsule: (capsule: Omit<CapsuleItem, 'id' | 'createdAt'>) => void;

  // Onboarding & Guided State
  onboardingStep: number | null;
  setOnboardingStep: (step: number | null) => void;
  completeOnboardingStep: (step: number) => void;
  dismissOnboarding: () => void;

  // Demo Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;

  // Product Tour
  tourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;

  // Journey & Recommendation
  journeyProgress: UserJourneyState;
  nextAction: RecommendedAction;

  // Modals state
  modals: {
    createWorkspace: boolean;
    createShareLink: boolean;
    autoFix: boolean;
    upgradePlan: boolean;
    viewer: { open: boolean; capsuleId?: string; capsuleName?: string };
  };
  openModal: (modal: 'createWorkspace' | 'createShareLink' | 'autoFix' | 'upgradePlan') => void;
  closeModal: (modal: 'createWorkspace' | 'createShareLink' | 'autoFix' | 'upgradePlan') => void;
  openViewer: (capsuleId: string, capsuleName?: string) => void;
  closeViewer: () => void;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  { id: 'ws_supply_chain', name: 'Global Supply Chain', type: 'Enterprise Workspace', description: 'Logistics performance, carrier metrics, and regional transit times.', membersCount: 4, capsulesCount: 12 },
  { id: 'ws_finance', name: 'Financial Planning & Analysis', type: 'Finance Workspace', description: 'Executive P&L statements, margin analysis, and quarterly revenue forecasting.', membersCount: 6, capsulesCount: 8 },
  { id: 'ws_hr', name: 'People Ops & HR', type: 'HR Workspace', description: 'Headcount retention, recruitment funnel, and compensation reviews.', membersCount: 2, capsulesCount: 5 },
];

const MOCK_CAPSULES: CapsuleItem[] = [
  { id: 'caps_q3_logistics', name: 'Q3_Logistics_Global.dcaps', version: 'v1.2.0', size: '42 MB', hash: '8f9102...ab30', signature: 'ECDSA P-384', status: 'PUBLISHED', healthScore: 96, savings: '-58% (42MB)', createdAt: '2026-08-01' },
  { id: 'caps_hr_comp', name: 'HR_Compensation_2026.dcaps', version: 'v1.0.0', size: '18 MB', hash: '3c91a0...1111', signature: 'ECDSA P-384', status: 'ENCRYPTED', healthScore: 92, savings: '-64% (18MB)', createdAt: '2026-08-05' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(DEFAULT_WORKSPACES[0]);
  const [capsules, setCapsules] = useState<CapsuleItem[]>(MOCK_CAPSULES);

  // Guided state
  const [onboardingStep, setOnboardingStep] = useState<number | null>(1);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const [journeyProgress, setJourneyProgress] = useState<UserJourneyState>({
    workspaceCreated: true,
    reportUploaded: true,
    aiAnalyzed: true,
    optimized: false,
    shared: false,
  });

  const [modals, setModals] = useState({
    createWorkspace: false,
    createShareLink: false,
    autoFix: false,
    upgradePlan: false,
    viewer: { open: false, capsuleId: undefined as string | undefined, capsuleName: undefined as string | undefined },
  });

  // Calculate next recommended action dynamically
  const getNextAction = (): RecommendedAction => {
    if (!journeyProgress.workspaceCreated) {
      return {
        title: 'Create workspace to begin',
        explanation: 'Your workspace organizes dashboards, AI models, and team permissions.',
        actionLabel: 'Create Workspace',
        route: '/projects',
      };
    }
    if (!journeyProgress.reportUploaded) {
      return {
        title: 'Upload your first PBIX report',
        explanation: 'Ingest Power BI reports to extract VertiPaq data models & AST visuals.',
        actionLabel: 'Import PBIX Report',
        route: '/import',
      };
    }
    if (!journeyProgress.aiAnalyzed) {
      return {
        title: 'Run AI health analysis',
        explanation: 'Let AI evaluate performance, security compliance, and DAX optimization.',
        actionLabel: 'Analyze Report',
        route: '/health',
      };
    }
    if (!journeyProgress.optimized) {
      return {
        title: 'Review optimization suggestions',
        explanation: 'Apply automated 1-click fixes for PII masking and DAX performance.',
        actionLabel: 'Review Auto-Fixes',
        route: '/health',
      };
    }
    return {
      title: 'Share insights with your team',
      explanation: 'Generate passcode-protected secure share tokens for executive viewers.',
      actionLabel: 'Create Share Link',
      route: '/sharing',
    };
  };

  const createWorkspace = (name: string, description: string, department: string) => {
    const newWs: Workspace = {
      id: `ws_${Date.now()}`,
      name,
      type: `${department || 'Enterprise'} Workspace`,
      description: description || 'New workspace created for report management.',
      membersCount: 1,
      capsulesCount: 0,
    };
    setWorkspaces((prev) => [newWs, ...prev]);
    setActiveWorkspace(newWs);
    setJourneyProgress((prev) => ({ ...prev, workspaceCreated: true }));
    showToast({ type: 'success', title: 'Workspace Created', message: `Workspace "${name}" is now active!` });
  };

  const addCapsule = (capsule: Omit<CapsuleItem, 'id' | 'createdAt'>) => {
    const newCapsule: CapsuleItem = {
      ...capsule,
      id: `caps_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCapsules((prev) => [newCapsule, ...prev]);
    setJourneyProgress((prev) => ({ ...prev, reportUploaded: true, aiAnalyzed: true }));
    showToast({ type: 'success', title: 'Capsule Ingested', message: `Report compiled into encrypted ${capsule.name}` });
  };

  const completeOnboardingStep = (step: number) => {
    if (step >= 4) {
      setOnboardingStep(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dcaps_onboarding_done', 'true');
      }
    } else {
      setOnboardingStep(step + 1);
    }
  };

  const dismissOnboarding = () => {
    setOnboardingStep(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dcaps_onboarding_done', 'true');
    }
  };

  const toggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    if (nextMode) {
      setJourneyProgress({
        workspaceCreated: true,
        reportUploaded: true,
        aiAnalyzed: true,
        optimized: true,
        shared: true,
      });
      showToast({
        type: 'info',
        title: 'Demo Workspace Enabled',
        message: 'Exploring pre-populated Q3 Logistics sample dashboard & capsules.',
      });
    } else {
      showToast({
        type: 'info',
        title: 'Standard Workspace Active',
        message: 'Switched back to live workspace state.',
      });
    }
  };

  const startTour = () => {
    setTourActive(true);
    setTourStep(0);
  };
  const nextTourStep = () => setTourStep((prev) => prev + 1);
  const prevTourStep = () => setTourStep((prev) => Math.max(0, prev - 1));
  const endTour = () => setTourActive(false);

  const openModal = (modal: 'createWorkspace' | 'createShareLink' | 'autoFix' | 'upgradePlan') => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: 'createWorkspace' | 'createShareLink' | 'autoFix' | 'upgradePlan') => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const openViewer = (capsuleId: string, capsuleName?: string) => {
    setModals((prev) => ({
      ...prev,
      viewer: { open: true, capsuleId, capsuleName },
    }));
  };

  const closeViewer = () => {
    setModals((prev) => ({
      ...prev,
      viewer: { open: false, capsuleId: undefined, capsuleName: undefined },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        createWorkspace,
        capsules,
        addCapsule,
        onboardingStep,
        setOnboardingStep,
        completeOnboardingStep,
        dismissOnboarding,
        isDemoMode,
        toggleDemoMode,
        tourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
        journeyProgress,
        nextAction: getNextAction(),
        modals,
        openModal,
        closeModal,
        openViewer,
        closeViewer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
