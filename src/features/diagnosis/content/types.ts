import type { DiagnosisAnswers, DiagnosisQuestionId } from "@/features/diagnosis/model/options";
import type { DiagnosisStep, DiagnosisStepId } from "@/features/diagnosis/model/questions";
import type {
  DiagnosisArea,
  MaturityLevelId,
  NeedCategory,
} from "@/features/diagnosis/model/types";
import type { PlanId } from "@/types/catalog";

/*
 * Everything the diagnosis says, per language (SPEC-004, SPEC-009). The rules in
 * model/recommendation.ts only refer to keys of these records, so a missing translation is a
 * compile error and the logic never depends on wording.
 */

export type RuleReasonKey =
  | "large"
  | "mediumComplex"
  | "growth"
  | "webStarter"
  | "webPro"
  | "seoStarter"
  | "seoPro"
  | "automation"
  | "ai";

export type SignalReasonKey =
  | "noWebsite"
  | "outdatedWebsite"
  | "noWebLeads"
  | "plansToSell"
  | "highRepetitive"
  | "noAutomation"
  | "wantsChatbot"
  | "aiInterested"
  | "aiExploring"
  | "aiUsing"
  | "noSeo";

/** Services the engine can recommend through a rule (ids from the catalog). */
export type RecommendableServiceId =
  | "web-corporativa"
  | "rediseno-web"
  | "landing-pages"
  | "ecommerce"
  | "optimizacion-rendimiento"
  | "chatbots"
  | "asistentes-internos"
  | "reduccion-tareas"
  | "clasificacion-leads"
  | "integraciones-crm"
  | "seo-tecnico"
  | "geo";

export type QuestionCopy = {
  [K in DiagnosisQuestionId]: { label: string; options: Record<DiagnosisAnswers[K], string> };
};

/** Copy used by the engine on the server (never shipped to the browser). */
export interface DiagnosisEngineCopy {
  areas: Record<DiagnosisArea, string>;
  levels: Record<MaturityLevelId, { label: string; summary: string }>;
  ruleReasons: Record<RuleReasonKey, string>;
  /** Template with `{area}`, used when even the top need is low. */
  solidBaseReason: string;
  areaPhrases: Record<NeedCategory, string>;
  signalReasons: Record<SignalReasonKey, string>;
  fallbackReasons: Record<NeedCategory, string>;
  serviceReasons: Record<RecommendableServiceId, string>;
  flagshipReasons: Record<NeedCategory, string>;
  nextSteps: { first: string; last: string; preparation: Record<PlanId, string> };
}

/** Interface strings of the wizard, the result and its lead form. Templates use `{name}`. */
export interface DiagnosisUiStrings {
  intro: {
    title: string;
    /** `{count}` = number of questions. */
    text: string;
    outcomes: string[];
    facts: { steps: string; time: string; signup: string };
    factLabels: { steps: string; time: string; signup: string };
    privacy: string;
    start: string;
  };
  /** `{current}` and `{total}`. */
  progress: string;
  /** Prefix read by screen readers before the step title; `{current}` and `{total}`. */
  stepPrefix: string;
  previous: string;
  next: string;
  finish: string;
  calculating: { title: string; text: string };
  error: {
    title: string;
    answersKept: string;
    retry: string;
    review: string;
    offline: string;
    invalid: string;
    server: string;
  };
  result: {
    title: string;
    subtitle: string;
    /** `{score}` and `{level}`. */
    scoreHeading: string;
    outOf: string;
    maturity: string;
    planEyebrow: string;
    vatExcluded: string;
    why: string;
    /** `{plan}`. */
    planLink: string;
    services: string;
    /** `{category}`. */
    moreAbout: string;
    nextSteps: string;
    change: string;
  };
  leadForm: {
    title: string;
    /** `{plan}`. */
    text: string;
    messageLabel: string;
    consent: string;
    submit: string;
    /** `{name}`. */
    successTitle: string;
    /** `{email}` is rendered in bold. */
    successText: string;
  };
}

export interface DiagnosisContent {
  steps: Record<DiagnosisStepId, { title: string; description: string }>;
  questions: QuestionCopy;
  requiredMessage: string;
  engine: DiagnosisEngineCopy;
  ui: DiagnosisUiStrings;
}

/** The serializable part the client wizard needs: built on the server, passed as props. */
export interface DiagnosisUiContent {
  steps: DiagnosisStep[];
  questionCount: number;
  requiredMessage: string;
  ui: DiagnosisUiStrings;
}
