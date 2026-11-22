export const INTERVIEW_MSGS = {
  SUCCESS: {
    SESSION_STARTED: 'Interview session initiated successfully',
    RESPONSE_RECORDED: 'Response recorded and next question generated',
    SESSION_CONCLUDED: 'Interview session concluded and scorecard generated',
    REPORT_FETCHED: 'Interview report retrieved successfully',
    VISIBILITY_UPDATED: 'Interview showcase visibility updated',
  },
  ERR: {
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    SESSION_NOT_FOUND: 'Interview session not found',
    SESSION_ALREADY_COMPLETED: 'Interview session is already concluded',
    SESSION_NOT_IN_PROGRESS: 'Interview session is not in progress',
    NOT_SESSION_OWNER: 'You are not the owner of this interview session',
    FAILED_TO_START: 'Failed to start interview session',
    FAILED_TO_RESPOND: 'Failed to process interview response',
    FAILED_TO_CONCLUDE: 'Failed to conclude interview session',
    FAILED_TO_FETCH_REPORT: 'Failed to fetch interview report',
    FAILED_TO_LIST_INTERVIEWS: 'Failed to list interview sessions',
  },
} as const;

export const DEFAULT_MAX_TURNS = 4;
