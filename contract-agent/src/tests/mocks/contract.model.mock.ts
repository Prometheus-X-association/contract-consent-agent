import mongoose, { Schema, Document, Model } from 'mongoose';
import { MongooseProvider } from '../../MongooseProvider';

export interface IContract extends Document {
  uid: string;
  profile: string;
  ecosystem: string;
  orchestrator: string;
  members: {
    participant: string;
    role: string;
    signature: string;
    date?: Date;
  }[];
  serviceOfferings: {
    participant: string;
    serviceOffering: string;
    policies: any[];
  }[];
  rolesAndObligations: any[];
  purpose: any[];
  revokedMembers: any[];
  status: 'signed' | 'revoked' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
}

// Ecosystem Contract Model / Dataspace User Case
const PurposeSchema = new Schema({
  uid: String,
  purpose: String,
  action: String,
  assigner: String,
  assignee: String,
  purposeCategory: String,
  consentType: String,
  piiCategory: String,
  primaryPurpose: String,
  termination: String,
  thirdPartyDisclosure: String,
  thirdPartyName: String,
});

const ConstraintSchema = new Schema(
  {
    '@type': String,
    leftOperand: String,
    operator: String,
    rightOperand: mongoose.Schema.Types.Mixed,
  },
  { strict: false, _id: false },
);

const ConsequenceSchema = new Schema(
  {
    action: String,
    constraint: [ConstraintSchema],
    consequence: [this],
  },
  { _id: false },
);
const DutySchema = new Schema(
  {
    action: String,
    constraint: [ConstraintSchema],
    consequence: [ConsequenceSchema],
  },
  { _id: false },
);
const PolicySchema = new Schema(
  {
    uid: String,
    description: String,
    permission: [
      {
        action: String,
        target: String,
        duty: [DutySchema],
        constraint: [ConstraintSchema],
        _id: false,
      },
    ],
    prohibition: [
      {
        action: String,
        target: String,
        constraint: [ConstraintSchema],
        _id: false,
      },
    ],
  },
  { _id: false },
);
const OfferingSchema = new Schema({
  participant: { type: String, required: true },
  serviceOffering: { type: String, required: true },
  policies: [PolicySchema],
});
const MemberSchema = new Schema(
  {
    participant: { type: String, required: true },
    role: { type: String, required: true },
    signature: { type: String, required: true },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const InfrastructureServiceSchema = new Schema({
  participant: { type: String, required: true },
  serviceOffering: { type: String, required: true },
});

const DataProcessingSchema = new Schema({
  catalogId: { type: String, required: true },
  infrastructureServices: { type: [InfrastructureServiceSchema], default: [] },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

const ContractSchema: Schema = new Schema(
  {
    uid: String,
    profile: String,
    ecosystem: String,
    orchestrator: String,
    serviceOfferings: [OfferingSchema],
    rolesAndObligations: [{ role: String, policies: [PolicySchema] }],
    dataProcessings: { type: [DataProcessingSchema], default: [] },
    purpose: [PurposeSchema],
    members: [MemberSchema],
    revokedMembers: [MemberSchema],
    status: {
      type: String,
      enum: ['signed', 'revoked', 'pending'],
      default: 'pending',
    },
    jsonLD: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// export default mongoose.model<IContract>('Contract', ContractSchema);

const config = {
  useProvider: true,
};

let contractModelInstance: Model<IContract> | null = null;

export default {
  schema: ContractSchema,
  getModel: async (): Promise<Model<IContract>> => {
    if (!contractModelInstance) {
      MongooseProvider.setCollectionModel<IContract>(
        'contracts',
        ContractSchema,
      );
      try {
        contractModelInstance = mongoose.model<IContract>('Contract');
      } catch {
        contractModelInstance = mongoose.model<IContract>(
          'Contract',
          ContractSchema,
        );
      }
    }
    return contractModelInstance;
  },
};
