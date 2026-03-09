export type CaseType = '纠结' | '拒贷' | '正常' | '逾期';

export interface CaseIntro {
  title: string;
  time: string;
  customerName: string;
  customerType: string;
  industry: string;
  amount: string;
}

export interface CustomerInfo {
  family: string;
  business: string;
  assetsLiabilities: string;
}

export interface LoanScheme {
  rate: string;
  term: string;
  guarantee: string;
  repayment: string;
}

export interface Investigation {
  offSite: string;
  onSite: string;
}

export interface CaseRecord {
  id: string;
  name: string;
  customerName: string;
  customerId?: string;
  businessType?: string;
  duration: string;
  date: string;
  type: CaseType;
  intro: CaseIntro;
  customerInfo: CustomerInfo;
  loanScheme: LoanScheme;
  investigation: Investigation;
  decisionFocus: string;
  recordings: Record<string, string>; // Map of module label to recording data
}
