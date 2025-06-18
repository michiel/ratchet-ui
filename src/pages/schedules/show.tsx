import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TagField, TextField } from "@refinedev/antd";
import { Typography, Card, Row, Col, Switch, Divider, Tag, Button, Space } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Schedule } from "../../types/ratchet";

const { Title, Text, Paragraph } = Typography;

export const ScheduleShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<Schedule>();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Basic Information">
            <Title level={4}>{record?.name}</Title>
            <Paragraph>
              <Text strong>ID:</Text> {record?.id}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text>{" "}
              <Switch checked={record?.enabled} disabled size="small" />
              <Text style={{ marginLeft: 8 }}>
                {record?.enabled ? "Enabled" : "Disabled"}
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Description:</Text>
              <br />
              {record?.description || "No description provided"}
            </Paragraph>
            <Paragraph>
              <Text strong>Task ID:</Text> <Tag color="blue">{record?.taskId}</Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Created:</Text>{" "}
              {record?.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A"}
            </Paragraph>
            <Paragraph>
              <Text strong>Updated:</Text>{" "}
              {record?.updatedAt ? new Date(record.updatedAt).toLocaleString() : "N/A"}
            </Paragraph>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Schedule Configuration">
            <Paragraph>
              <Text strong>Cron Expression:</Text>
              <br />
              <Tag color="purple" style={{ fontSize: '14px', padding: '4px 8px' }}>
                {record?.cronExpression}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Timezone:</Text> {record?.timezone || "UTC"}
            </Paragraph>
            <Paragraph>
              <Text strong>Next Run:</Text>{" "}
              {record?.nextRun ? (
                <Tag color="green">{new Date(record.nextRun).toLocaleString()}</Tag>
              ) : (
                <Tag color="default">Not scheduled</Tag>
              )}
            </Paragraph>
            <Paragraph>
              <Text strong>Last Run:</Text>{" "}
              {record?.lastRun ? (
                <Tag color="blue">{new Date(record.lastRun).toLocaleString()}</Tag>
              ) : (
                <Tag color="default">Never</Tag>
              )}
            </Paragraph>
            
            <Divider />
            
            <Space>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                disabled={!record?.enabled}
              >
                Trigger Now
              </Button>
              <Button 
                type="default" 
                icon={record?.enabled ? <StopOutlined /> : <PlayCircleOutlined />}
              >
                {record?.enabled ? "Disable" : "Enable"}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={24}>
          <Card title="Task Input Configuration">
            {record?.taskInput ? (
              <pre style={{ 
                backgroundColor: "#f5f5f5", 
                padding: "12px", 
                borderRadius: "4px",
                overflow: "auto"
              }}>
                {JSON.stringify(record.taskInput, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">No task input configured</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={24}>
          <Card title="Cron Expression Help">
            <div style={{ marginBottom: 16 }}>
              <Text strong>Current Expression:</Text> <code>{record?.cronExpression}</code>
            </div>
            <Text strong>Format:</Text> <code>minute hour day-of-month month day-of-week</code>
            <div style={{ marginTop: 12 }}>
              <Text strong>Common Patterns:</Text>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li><code>0 9 * * MON-FRI</code> - Every weekday at 9:00 AM</li>
                <li><code>0 0 * * 0</code> - Every Sunday at midnight</li>
                <li><code>*/15 * * * *</code> - Every 15 minutes</li>
                <li><code>0 */6 * * *</code> - Every 6 hours</li>
                <li><code>0 0 1 * *</code> - First day of every month</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};