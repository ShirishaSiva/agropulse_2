export interface AnalysisResult {
  immediateAction: {
    instruction: string;
    severity: 'safe' | 'warning' | 'alert';
  };
  diagnosis: string;
  threats: {
    type: string;
    location: string;
    radiusKm: number;
    description: string;
    coordinates?: { lat: number; lng: number };
  }[];
  marketAdvice: {
    recommendation: string;
    reasoning: string;
  };
  verificationSource: string;
  detectedLanguage: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  ANALYZE = 'analyze',
}
