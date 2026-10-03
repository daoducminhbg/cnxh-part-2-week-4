export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface OptionItem {
  id: OptionId;
  label: string;
  text: string;
  subtext?: string;
}

export interface Scenario {
  id: string;
  code: string;
  title: string;
  topic: string;
  caseBackground: string;
  question: string;
  options: OptionItem[];
  correctOptionId: OptionId;
  doctrineQuote: string;
  academicExplanation: string;
  constitutionalCitation: string;
}

export interface VoteTally {
  totalVotes: number;
  counts: Record<OptionId, number>;
  percentages: Record<OptionId, number>;
}

export type ReferendumStatus = 'idle' | 'voting' | 'closed' | 'revealed';

export interface DelegateVoterState {
  remaining: number;
  max: number;
  isActive: boolean;
  speakerName?: string;
  timerDuration: number;
  remainingTime: number;
  timerRunning: boolean;
  recommendedOption?: OptionId | null;
}

export interface ReferendumState {
  remaining: number;
  max: number;
  isActive: boolean;
  status: ReferendumStatus;
  duration: number;
  remainingTime: number;
}

export interface LifelinesConfig {
  delegateVoter: DelegateVoterState;
  referendum: ReferendumState;
}

export type SfxType = 
  | 'gavel' 
  | 'clock_tick' 
  | 'time_up' 
  | 'victory' 
  | 'alert_wrong' 
  | 'applause' 
  | 'drum_roll' 
  | 'none';

export interface SfxEvent {
  type: SfxType;
  timestamp: number;
}

export interface ParliamentSessionState {
  scenarios: Scenario[];
  currentScenarioId: string;
  scenarioIndex: number;
  totalScenarios: number;
  delegateName: string;
  selectedOptionId: OptionId | null;
  isAnswerRevealed: boolean;
  isAnswerCorrect: boolean | null;
  lifelines: LifelinesConfig;
  voteTally: VoteTally;
  voterSessions: Record<string, OptionId>; // deviceId/voterId -> option
  sfxEvent: SfxEvent;
  lastUpdated: number;
}
