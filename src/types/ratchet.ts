// Ratchet API Type Definitions

// Base types
export type ApiId = string;

export interface BaseResponse {
  id: ApiId;
  createdAt?: string;
  updatedAt?: string;
}

// Task schema types
export interface InputSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface OutputSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
}

export interface TaskDefinition {
  command: string;
  environment?: Record<string, string>;
  inputSchema: InputSchema;
  outputSchema: OutputSchema;
  timeout?: number;
  workingDirectory?: string;
}

// Task types
export interface Task extends BaseResponse {
  name: string;
  version: string;
  description?: string;
  enabled: boolean;
  definition: TaskDefinition;
  uuid?: string;
  registrySource?: boolean;
  inSync?: boolean;
  validatedAt?: string;
}

export interface CreateTaskRequest {
  name: string;
  version: string;
  description?: string;
  enabled?: boolean;
  definition: TaskDefinition;
}

export interface UpdateTaskRequest {
  name?: string;
  version?: string;
  description?: string;
  enabled?: boolean;
  definition?: TaskDefinition;
}

export interface TaskStats {
  totalTasks: number;
  enabledTasks: number;
  disabledTasks: number;
  registryTasks: number;
  databaseTasks: number;
  validationErrors: number;
  lastSync?: string;
}

// Execution types
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Execution extends BaseResponse {
  taskId: ApiId;
  status: ExecutionStatus;
  input: any;
  output?: any;
  errorMessage?: string;
  errorDetails?: any;
  progress?: number;
  priority?: string;
  scheduledFor?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  queuedAt: string;
  canRetry?: boolean;
  canCancel?: boolean;
}

export interface CreateExecutionRequest {
  taskId: ApiId;
  input: any;
  priority?: string;
  scheduledFor?: string;
}

export interface UpdateExecutionRequest {
  status?: ExecutionStatus;
  output?: any;
  errorMessage?: string;
  errorDetails?: any;
  progress?: number;
}

export interface RetryExecutionRequest {
  priority?: string;
  scheduledFor?: string;
}

export interface ExecutionStats {
  totalExecutions: number;
  pendingExecutions: number;
  runningExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  cancelledExecutions: number;
  successRate: number;
  executionsLast24h: number;
  averageDurationMs?: number;
}

// Job types
export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING';
export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Job extends BaseResponse {
  taskId: ApiId;
  status: JobStatus;
  priority: JobPriority;
  input: any;
  output?: any;
  errorMessage?: string;
  maxRetries: number;
  retryCount: number;
  scheduledFor?: string;
  startedAt?: string;
  completedAt?: string;
  queuedAt: string;
  lastAttemptAt?: string;
}

export interface CreateJobRequest {
  taskId: ApiId;
  input: any;
  priority?: JobPriority;
  maxRetries?: number;
  scheduledFor?: string;
  outputDestinations?: any[];
}

export interface UpdateJobRequest {
  status?: JobStatus;
  priority?: JobPriority;
  maxRetries?: number;
  scheduledFor?: string;
  errorMessage?: string;
}

export interface JobStats {
  totalJobs: number;
  queuedJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  retryingJobs: number;
  jobsLast24h: number;
  averageWaitTimeMs?: number;
}

// Schedule types
export interface Schedule extends BaseResponse {
  taskId: ApiId;
  name: string;
  description?: string;
  cronExpression: string;
  enabled: boolean;
  nextRun?: string;
  lastRun?: string;
  timezone?: string;
  taskInput: any;
}

export interface CreateScheduleRequest {
  taskId: ApiId;
  name: string;
  description?: string;
  cronExpression: string;
  enabled?: boolean;
  timezone?: string;
  taskInput: any;
}

export interface UpdateScheduleRequest {
  name?: string;
  description?: string;
  cronExpression?: string;
  enabled?: boolean;
  timezone?: string;
  taskInput?: any;
}

export interface ScheduleStats {
  totalSchedules: number;
  enabledSchedules: number;
  disabledSchedules: number;
  schedulesReadyToRun: number;
  lastExecution?: string;
  nextExecution?: string;
  averageExecutionIntervalMinutes?: number;
}

// Metrics types
export interface DatabaseMetrics {
  connectionPoolSize: number;
  activeConnections: number;
  idleConnections: number;
  totalQueries: number;
  slowQueries: number;
  averageQueryTimeMs: number;
  connectionErrors: number;
}

export interface ExecutionMetrics {
  totalExecutions: number;
  runningExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  cancelledExecutions: number;
  averageExecutionTimeMs: number;
  successRatePercent: number;
}

export interface JobMetrics {
  totalJobs: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageQueueTimeMs: number;
  retryCount: number;
}

export interface ScheduleMetrics {
  totalSchedules: number;
  enabledSchedules: number;
  overdueSchedules: number;
  successfulTriggers: number;
  failedTriggers: number;
  nextExecutionInSeconds?: number;
}

export interface TaskMetrics {
  totalTasks: number;
  enabledTasks: number;
  validatedTasks: number;
  tasksWithErrors: number;
  registrySyncCount: number;
  lastSyncTimestamp?: string;
}

export interface PerformanceMetrics {
  requestsPerSecond: number;
  averageResponseTimeMs: number;
  p95ResponseTimeMs: number;
  p99ResponseTimeMs: number;
  errorRatePercent: number;
  successRatePercent: number;
}

export interface ResourceMetrics {
  memoryUsageMb: number;
  memoryUsagePercent: number;
  cpuUsagePercent: number;
  heapSizeMb: number;
  heapUsedMb: number;
  gcCount: number;
  threadCount: number;
  fileDescriptors: number;
}

export interface SystemInfo {
  version: string;
  buildTimestamp: string;
  rustVersion: string;
  targetTriple: string;
  uptimeSeconds: number;
  gitCommit?: string;
}

export interface ApplicationMetrics {
  database: DatabaseMetrics;
  tasks: TaskMetrics;
  executions: ExecutionMetrics;
  jobs: JobMetrics;
  schedules: ScheduleMetrics;
}

export interface SystemMetrics {
  systemInfo: SystemInfo;
  performance: PerformanceMetrics;
  resources: ResourceMetrics;
  application: ApplicationMetrics;
}

// Health check
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services?: Record<string, 'up' | 'down'>;
}

// API response types
export interface ListResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// Filter and pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TaskFilters extends PaginationParams {
  filter?: string;
  sort?: string;
}

export interface ExecutionFilters extends PaginationParams {
  status?: ExecutionStatus;
  task_id?: string;
  sort?: string;
}

export interface JobFilters extends PaginationParams {
  status?: JobStatus;
  priority?: JobPriority;
  task_id?: string;
  sort?: string;
}

export interface ScheduleFilters extends PaginationParams {
  enabled?: boolean;
  task_id?: string;
  sort?: string;
}