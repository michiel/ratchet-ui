import React from "react";
import { IResourceComponentsProps, useShow, useOne } from "@refinedev/core";
import { Show, TagField, TextField } from "@refinedev/antd";
import { Typography, Card, Row, Col, Tag, Progress, Timeline, Button, Space, Divider } from "antd";
import { Job, JobStatus, JobPriority, Task } from "../../types/ratchet";

const { Title, Text, Paragraph } = Typography;

export const JobShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<Job>();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  // Fetch associated task information
  const { data: taskData } = useOne<Task>({
    resource: "tasks",
    id: record?.taskId || "",
    queryOptions: {
      enabled: !!record?.taskId,
    },
  });

  const task = taskData?.data;

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'QUEUED': return 'blue';
      case 'PROCESSING': return 'orange';
      case 'COMPLETED': return 'green';
      case 'FAILED': return 'red';
      case 'CANCELLED': return 'gray';
      case 'RETRYING': return 'purple';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: JobPriority) => {
    switch (priority) {
      case 'LOW': return 'blue';
      case 'NORMAL': return 'default';
      case 'HIGH': return 'orange';
      case 'CRITICAL': return 'red';
      default: return 'default';
    }
  };

  const getTimelineItems = () => {
    const items = [];
    
    if (record?.queuedAt) {
      items.push({
        color: 'blue',
        children: (
          <div>
            <Text strong>Job Queued</Text>
            <br />
            <Text type="secondary">{new Date(record.queuedAt).toLocaleString()}</Text>
          </div>
        ),
      });
    }

    if (record?.startedAt) {
      items.push({
        color: 'orange',
        children: (
          <div>
            <Text strong>Job Started</Text>
            <br />
            <Text type="secondary">{new Date(record.startedAt).toLocaleString()}</Text>
          </div>
        ),
      });
    }

    if (record?.lastAttemptAt) {
      items.push({
        color: 'purple',
        children: (
          <div>
            <Text strong>Last Attempt</Text>
            <br />
            <Text type="secondary">{new Date(record.lastAttemptAt).toLocaleString()}</Text>
          </div>
        ),
      });
    }

    if (record?.completedAt) {
      const color = record.status === 'COMPLETED' ? 'green' : 'red';
      items.push({
        color,
        children: (
          <div>
            <Text strong>{record.status === 'COMPLETED' ? 'Job Completed' : 'Job Failed/Cancelled'}</Text>
            <br />
            <Text type="secondary">{new Date(record.completedAt).toLocaleString()}</Text>
          </div>
        ),
      });
    }

    return items;
  };

  return (
    <Show isLoading={isLoading}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Job Overview">
            <Title level={4}>Job #{record?.id}</Title>
            <Paragraph>
              <Text strong>Task:</Text> {task ? `${task.name} (v${task.version})` : record?.taskId}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text>{" "}
              <Tag color={getStatusColor(record?.status || 'QUEUED')}>
                {record?.status}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Priority:</Text>{" "}
              <Tag color={getPriorityColor(record?.priority || 'NORMAL')}>
                {record?.priority}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Retries:</Text> {record?.retryCount || 0} / {record?.maxRetries || 0}
              {record?.maxRetries && (
                <Progress 
                  percent={((record.retryCount || 0) / record.maxRetries) * 100} 
                  size="small"
                  style={{ marginLeft: 16, width: 100 }}
                />
              )}
            </Paragraph>
            {record?.scheduledFor && (
              <Paragraph>
                <Text strong>Scheduled For:</Text>{" "}
                {new Date(record.scheduledFor).toLocaleString()}
              </Paragraph>
            )}
            {record?.errorMessage && (
              <Paragraph>
                <Text strong>Error:</Text>
                <br />
                <Text type="danger">{record.errorMessage}</Text>
              </Paragraph>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Timeline">
            <Timeline items={getTimelineItems()} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={12}>
          <Card title="Input Data">
            {record?.input ? (
              <pre style={{ 
                backgroundColor: "#f5f5f5", 
                padding: "12px", 
                borderRadius: "4px",
                overflow: "auto",
                maxHeight: "300px"
              }}>
                {JSON.stringify(record.input, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">No input data</Text>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Output Data">
            {record?.output ? (
              <pre style={{ 
                backgroundColor: "#f5f5f5", 
                padding: "12px", 
                borderRadius: "4px",
                overflow: "auto",
                maxHeight: "300px"
              }}>
                {JSON.stringify(record.output, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">No output data</Text>
            )}
          </Card>
        </Col>
      </Row>

      {task && (
        <>
          <Divider />
          <Card title="Task Information">
            <Paragraph>
              <Text strong>Description:</Text> {task.description || "No description"}
            </Paragraph>
            <Paragraph>
              <Text strong>Enabled:</Text> {task.enabled ? "Yes" : "No"}
            </Paragraph>
            {task.definition?.inputSchema && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Expected Input Schema:</Text>
                <pre style={{ 
                  backgroundColor: "#f5f5f5", 
                  padding: "12px", 
                  borderRadius: "4px",
                  overflow: "auto",
                  marginTop: "8px"
                }}>
                  {JSON.stringify(task.definition.inputSchema, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        </>
      )}
    </Show>
  );
};