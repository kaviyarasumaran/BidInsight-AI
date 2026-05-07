/**
 * JSDoc types for API payloads/responses (keeps project JS-only).
 */

/**
 * @typedef {Object} TenderCreateRequest
 * @property {string} tender_title
 * @property {string} department
 * @property {string=} description
 * @property {string} created_by
 */

/**
 * @typedef {Object} TenderCreateResponse
 * @property {string} tender_id
 * @property {string} status
 */

/**
 * @typedef {Object} TenderInputResponse
 * @property {string} upload_id
 * @property {string} processing_job_id
 */

/**
 * @typedef {Object} JobStatusResponse
 * @property {string} job_id
 * @property {string} type
 * @property {"queued"|"processing"|"completed"|"failed"|"manual_review_required"} status
 * @property {number} progress
 * @property {string=} current_step
 * @property {string=} estimated_next_step
 */

/**
 * @typedef {Object} JobLogLine
 * @property {string} ts
 * @property {string} level
 * @property {string} message
 */

/**
 * @typedef {Object} JobLogsResponse
 * @property {string} job_id
 * @property {number} total
 * @property {number} offset
 * @property {number} limit
 * @property {JobLogLine[]} lines
 */

/**
 * @typedef {Object} ComputerStage
 * @property {string} name
 * @property {"queued"|"processing"|"completed"|"failed"|"manual_review_required"|"unknown"} status
 * @property {string=} duration
 */

/**
 * @typedef {Object} JobComputerStatusResponse
 * @property {string} job_id
 * @property {number} overall_progress
 * @property {string} current_stage
 * @property {ComputerStage[]} stages
 */

/**
 * @typedef {Object} LivePreviewCriterion
 * @property {string} criterion
 * @property {string=} status
 * @property {string=} source
 */

/**
 * @typedef {Object} JobLivePreviewResponse
 * @property {LivePreviewCriterion[]} detected_criteria
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} Criterion
 * @property {string} criterion_id
 * @property {string} text
 * @property {string=} category
 * @property {boolean=} mandatory
 * @property {number=} confidence
 */

/**
 * @typedef {Object} CriteriaResponse
 * @property {string} tender_id
 * @property {Criterion[]} criteria
 */
