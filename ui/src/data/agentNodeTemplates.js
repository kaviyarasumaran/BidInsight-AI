const agentNodeTemplates = [
  {
    type: 'Start',
    description: 'Start node for workflow entry point.',
    parameters: [],
    outputParameters: [],
    githubRepo: null,
    iconName: 'IconPlayerPlay',
    iconColor: '#4caf50'
  },
  {
    type: 'End',
    description: 'End node for workflow termination.',
    parameters: [],
    outputParameters: [],
    githubRepo: null,
    iconName: 'material-symbols:line-end-square-rounded',
    iconColor: '#f44336'
  },
  // {
  //   type: 'Data Ingestion',
  //   description: 'Ingests documents and saves runId in vector db metadata.',
  //   parameters: [
  //     { name: 'documents', description: 'List of links of documents to ingest', type: 'string[]' },
  //     { name: 'runId', description: 'Run ID to save in the metadata of the vector db', type: 'string' }
  //   ],
  //   outputParameters: [
  //     { name: 'status', description: 'Status of the ingestion', type: 'string' }
  //   ],
  //   githubRepo: 'zentis-data-ingestion',
  //   iconName: 'IconFileImport',
  //   iconColor: '#1976d2'
  // },
  // {
  //   type: 'folderMapToString',
  //   description: 'Maps folder contents to string.',
  //   parameters: [
  //     { name: 'runId', description: 'Run ID', type: 'string' },
  //     { name: 'folderToMap', description: 'Path to azure blob folder', type: 'string' },
  //     { name: 'mapLevel', description: 'row/file', type: 'string' }
  //   ],
  //   outputParameters: [
  //     { name: 'mapResults', description: 'Combined list of string', type: 'string[]' }
  //   ],
  //   githubRepo: 'zentis-folder-operations',
  //   iconName: 'IconFolder',
  //   iconColor: '#ff9800'
  // },
  // {
  //   type: 'Combine',
  //   description: 'Combines folder operations.',
  //   parameters: [],
  //   outputParameters: [],
  //   githubRepo: 'zentis-folder-operations',
  //   iconName: 'IconListCheck',
  //   iconColor: '#9c27b0'
  // },
  // {
  //   type: 'Human',
  //   description: 'Human node for manual intervention.',
  //   parameters: [],
  //   outputParameters: [],
  //   githubRepo: null,
  //   iconName: 'IconUser',
  //   iconColor: '#607d8b'
  // },
  // {
  //   type: 'Agent',
  //   description: 'Executes an agent with given configuration and input.',
  //   parameters: [
  //     { name: 'runID', description: 'Run ID', type: 'string' },
  //     { name: 'input', description: 'Input for the agent', type: 'any' },
  //     { name: 'agentConfigId', description: 'Agent configuration ID', type: 'string' }
  //   ],
  //   outputParameters: [],
  //   githubRepo: 'zentis-agent',
  //   iconName: 'IconRobot',
  //   iconColor: '#2196f3'
  // },
  // {
  //   type: 'ParallelAgent',
  //   description: 'Executes multiple agents in parallel and combines outputs.',
  //   parameters: [
  //     { name: 'runID', description: 'Run ID', type: 'string' },
  //     { name: 'input', description: 'Input for the agent', type: 'any' },
  //     { name: 'agentConfigId', description: 'Agent configuration ID', type: 'string' }
  //   ],
  //   outputParameters: [],
  //   githubRepo: 'zentis-parallel-agent',
  //   iconName: 'IconGitBranch',
  //   iconColor: '#43a047'
  // },
  // {
  //   type: 'IfElse',
  //   description: 'Conditional node for branching logic.',
  //   parameters: [
  //     { name: 'condition', description: 'Condition to evaluate', type: 'string' },
  //     { name: 'field', description: 'Execution parameter name', type: 'string' },
  //     { name: 'value', description: 'Next node for the respective execution parameter', type: 'string' }
  //   ],
  //   outputParameters: [],
  //   githubRepo: 'zentis-conditional',
  //   iconName: 'IconGitCompare',
  //   iconColor: '#fb8c00'
  // },
  // {
  //   type: 'Communication',
  //   description: 'Handles communication tasks.',
  //   parameters: [],
  //   outputParameters: [],
  //   githubRepo: 'zentis-communication',
  //   iconName: 'IconMessageDots',
  //   iconColor: '#4caf50'
  // },
  // {
  //   type: 'persistToDb',
  //   description: 'Persists data to the database.',
  //   parameters: [],
  //   outputParameters: [],
  //   githubRepo: 'zentis-db-operations',
  //   iconName: 'IconDatabase',
  //   iconColor: '#795548'
  // },
  {
    type: 'Proposal Intake',
    description: 'System task for proposal submission completeness check and case ID assignment.',
    parameters: [
      { name: 'submission', description: 'Proposal submission data', type: 'object' },
      { name: 'sla', description: 'SLA time in minutes', type: 'number', defaultValue: 30 }
    ],
    outputParameters: [
      { name: 'caseId', description: 'Assigned case ID', type: 'string' },
      { name: 'completeness', description: 'Submission completeness status', type: 'string' },
      { name: 'status', description: 'Processing status', type: 'string' }
    ],
    githubRepo: 'zentis-proposal-intake',
    iconName: 'IconFileText',
    iconColor: '#2196f3',
    metadata: {
      taskOwner: 'System',
      sla: '30 minutes',
      hitl: false,
      mappedAgent: 'None (system task)',
      decisionRules: 'Check for completeness of submission, assign case ID',
      thresholds: null,
      nodeDetails: {
        title: 'Node 1: Proposal Intake',
        taskOwner: 'System',
        decisionRules: 'Check for completeness of submission, assign case ID',
        sla: '30 minutes',
        hitl: 'No',
        mappedAgent: 'None (system task)',
        shape: '🔹'
      }
    }
  },
  {
    type: 'Triage',
    description: 'AI agent for classifying proposals as Standard, Incomplete, or High-Risk.',
    parameters: [
      { name: 'caseId', description: 'Case ID from intake', type: 'string' },
      { name: 'proposalData', description: 'Proposal data for classification', type: 'object' },
      { name: 'confidenceThreshold', description: 'Confidence threshold for escalation', type: 'number', defaultValue: 75 }
    ],
    outputParameters: [
      { name: 'classification', description: 'Classification result (Standard/Incomplete/High-Risk)', type: 'string' },
      { name: 'confidence', description: 'Classification confidence score', type: 'number' },
      { name: 'escalationRequired', description: 'Whether escalation to UW is required', type: 'boolean' },
      { name: 'riskFactors', description: 'Identified risk factors', type: 'array' }
    ],
    githubRepo: 'zentis-triage-agent',
    iconName: 'IconClipboardCheck',
    iconColor: '#ff9800',
    metadata: {
      taskOwner: 'AI Agent',
      sla: '45 minutes',
      hitl: false,
      mappedAgent: 'Triage Agent',
      decisionRules: 'Classify as: Standard, Incomplete, or High-Risk. Incomplete = missing income proof, partial documents. High-risk = age > 55, SA > ₹50L, smoker',
      thresholds: 'Confidence < 75% → escalate to UW',
      nodeDetails: {
        title: 'Node 2: Triage',
        taskOwner: 'AI Agent',
        decisionRules: 'Classify as: Standard, Incomplete, or High-Risk\nIncomplete = missing income proof, partial documents\nHigh-risk = age > 55, SA > ₹50L, smoker',
        sla: '45 minutes',
        hitl: 'No',
        mappedAgent: '✅ Triage Agent',
        thresholds: 'Confidence < 75% → escalate to UW',
        shape: '🔹'
      }
    }
  },
  {
    type: 'Document Review',
    description: 'AI agent for document verification and consistency checking with optional UW intervention.',
    parameters: [
      { name: 'caseId', description: 'Case ID', type: 'string' },
      { name: 'documents', description: 'Documents to review', type: 'array' },
      { name: 'redFlagThreshold', description: 'Number of red flags before HITL escalation', type: 'number', defaultValue: 2 }
    ],
    outputParameters: [
      { name: 'reviewStatus', description: 'Document review status', type: 'string' },
      { name: 'inconsistencies', description: 'List of detected inconsistencies', type: 'array' },
      { name: 'redFlagCount', description: 'Number of red flags found', type: 'number' },
      { name: 'hitlRequired', description: 'Whether HITL intervention is required', type: 'boolean' },
      { name: 'verificationResults', description: 'Detailed verification results', type: 'object' }
    ],
    githubRepo: 'zentis-document-review',
    iconName: 'IconFileSearch',
    iconColor: '#4caf50',
    metadata: {
      taskOwner: 'AI Agent + Optional UW',
      sla: '1 hour',
      hitl: true,
      mappedAgents: ['Doc Interpretation Agent', 'Risk Flag Agent'],
      decisionRules: 'Match DOB, PAN, declared income vs. proof. Flag mismatch or missing documents',
      thresholds: '>2 red flags → escalate to HITL',
      nodeDetails: {
        title: 'Node 3: Document Review',
        taskOwner: 'AI Agent + Optional UW',
        decisionRules: 'Match DOB, PAN, declared income vs. proof\nFlag mismatch or missing documents',
        sla: '1 hour',
        hitl: 'Yes if inconsistencies are detected',
        mappedAgents: '✅ Doc Interpretation Agent\n✅ Risk Flag Agent',
        thresholds: '>2 red flags → escalate to HITL',
        shape: '🔹'
      }
    }
  },
  {
    type: 'Pricing Decision',
    description: 'AI agent for applying premium adjustment rules from the rulebook.',
    parameters: [
      { name: 'caseId', description: 'Case ID', type: 'string' },
      { name: 'riskProfile', description: 'Risk profile data', type: 'object' },
      { name: 'rulebook', description: 'Policy rulebook reference', type: 'string' }
    ],
    outputParameters: [
      { name: 'premiumAdjustment', description: 'Calculated premium adjustment percentage', type: 'number' },
      { name: 'appliedRules', description: 'List of applied rules', type: 'array' },
      { name: 'ruleConflicts', description: 'Any rule conflicts found', type: 'array' },
      { name: 'escalationRequired', description: 'Whether escalation is required due to rule issues', type: 'boolean' },
      { name: 'finalPremium', description: 'Final calculated premium', type: 'number' }
    ],
    githubRepo: 'zentis-pricing-agent',
    iconName: 'IconCalculator',
    iconColor: '#9c27b0',
    metadata: {
      taskOwner: 'AI Agent',
      sla: '1 hour',
      hitl: false,
      mappedAgent: 'Rulebook Lookup Agent',
      decisionRules: 'Apply premium adjustment rules from the rulebook. Example: BMI > 32 → +15%, Smoker → +25%',
      thresholds: 'Rule conflict or rule not found → escalate',
      nodeDetails: {
        title: 'Node 4: Pricing Decision',
        taskOwner: 'AI Agent',
        decisionRules: 'Apply premium adjustment rules from the rulebook\nExample: BMI > 32 → +15%, Smoker → +25%',
        sla: '1 hour',
        hitl: 'No',
        mappedAgent: '✅ Rulebook Lookup Agent',
        thresholds: 'Rule conflict or rule not found → escalate',
        shape: '🔹'
      }
    }
  },
  {
    type: 'Escalation',
    description: 'AI agent for claims risk modeling and routing flagged cases to Human UW.',
    parameters: [
      { name: 'caseId', description: 'Case ID', type: 'string' },
      { name: 'caseData', description: 'Complete case data', type: 'object' },
      { name: 'riskThreshold', description: 'Risk score threshold for escalation', type: 'number', defaultValue: 0.70 }
    ],
    outputParameters: [
      { name: 'riskScore', description: 'Calculated risk score', type: 'number' },
      { name: 'escalationRequired', description: 'Whether escalation is required', type: 'boolean' },
      { name: 'riskFactors', description: 'Key risk factors identified', type: 'array' },
      { name: 'explainablePacket', description: 'Explainable packet for Human UW', type: 'object' },
      { name: 'routingDecision', description: 'Routing decision for the case', type: 'string' }
    ],
    githubRepo: 'zentis-escalation',
    iconName: 'IconAlertTriangle',
    iconColor: '#f44336',
    metadata: {
      taskOwner: 'AI Agent + Human UW',
      sla: '2 hours',
      hitl: true,
      mappedAgents: ['Claims Propensity Agent', 'HITL Escalation Agent'],
      decisionRules: 'Run Claims Risk Model. Check if escalation is required (risk score > threshold). Route flagged cases to Human UW',
      thresholds: 'Risk Score > 0.70',
      nodeDetails: {
        title: 'Node 5: Escalation',
        taskOwner: 'AI Agent + Human UW',
        decisionRules: 'Run Claims Risk Model\nCheck if escalation is required (risk score > threshold)\nRoute flagged cases to Human UW',
        sla: '2 hours',
        hitl: '✅ Yes',
        mappedAgents: '✅ Claims Propensity Agent\n✅ HITL Escalation Agent',
        thresholds: 'Risk Score > 0.70',
        shape: '🔹'
      }
    }
  },
  {
    type: 'Issue Policy',
    description: 'Final policy issuance with optional decision suggestion based on case trail.',
    parameters: [
      { name: 'caseId', description: 'Case ID', type: 'string' },
      { name: 'caseTrail', description: 'Complete case processing trail', type: 'object' },
      { name: 'finalChecks', description: 'Final validation checks', type: 'object' }
    ],
    outputParameters: [
      { name: 'policyNumber', description: 'Issued policy number', type: 'string' },
      { name: 'issueStatus', description: 'Policy issue status', type: 'string' },
      { name: 'decisionSuggestion', description: 'AI decision suggestion', type: 'string' },
      { name: 'manualValidationRequired', description: 'Whether manual validation is required', type: 'boolean' },
      { name: 'issueDate', description: 'Policy issue date', type: 'string' }
    ],
    githubRepo: 'zentis-policy-issuance',
    iconName: 'IconFileCertificate',
    iconColor: '#00c853',
    metadata: {
      taskOwner: 'Human / Ops',
      sla: '3 hours',
      hitl: true,
      mappedAgent: 'None (optional: decision suggestion based on case trail)',
      decisionRules: 'Final STP issue if all checks pass. Else manual validation + issuance',
      thresholds: null,
      nodeDetails: {
        title: 'Node 6: Issue Policy',
        taskOwner: 'Human / Ops',
        decisionRules: 'Final STP issue if all checks pass\nElse manual validation + issuance',
        sla: '3 hours',
        hitl: 'Yes',
        mappedAgent: 'None (optional: decision suggestion based on case trail)',
        thresholds: null,
        shape: '🔹'
      }
    }
  }
];

export default agentNodeTemplates; 