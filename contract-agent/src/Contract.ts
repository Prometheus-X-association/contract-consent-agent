export interface Participant {
  participant: string;
  role: string;
  signature: string;
  date: string;
}

export interface Policy {
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

export interface ServiceOffering {
  participant: string;
  serviceOffering: string;
  policies: Policy[];
  _id: string;
}

export class Contract {
  _id: string;
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

  constructor(
    _id: string,
    createdAt: string,
    updatedAt: string,
    ecosystem: string,
    members: Participant[],
    orchestrator: string,
    purpose: string[],
    revokedMembers: Participant[],
    rolesAndObligations: any[],
    serviceOfferings: ServiceOffering[],
    status: string,
  ) {
    this._id = _id;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.ecosystem = ecosystem;
    this.members = members;
    this.orchestrator = orchestrator;
    this.purpose = purpose;
    this.revokedMembers = revokedMembers;
    this.rolesAndObligations = rolesAndObligations;
    this.serviceOfferings = serviceOfferings;
    this.status = status;
  }
}
