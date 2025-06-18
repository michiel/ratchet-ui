import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TagField, TextField } from "@refinedev/antd";
import { Typography, Card, Row, Col, Switch, Divider, Tag } from "antd";
import { Task } from "../../types/ratchet";

const { Title, Text, Paragraph } = Typography;

export const TaskShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<Task>();
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
              <Text strong>Version:</Text> <Tag color="blue">{record?.version}</Tag>
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
          <Card title="Task Definition">
            {record?.definition ? (
              <>
                <Paragraph>
                  <Text strong>Command:</Text>
                  <br />
                  <Text code>{record.definition.command}</Text>
                </Paragraph>
                {record.definition.workingDirectory && (
                  <Paragraph>
                    <Text strong>Working Directory:</Text>
                    <br />
                    <Text code>{record.definition.workingDirectory}</Text>
                  </Paragraph>
                )}
                {record.definition.timeout && (
                  <Paragraph>
                    <Text strong>Timeout:</Text> {record.definition.timeout}s
                  </Paragraph>
                )}
                {record.definition.environment && Object.keys(record.definition.environment).length > 0 && (
                  <>
                    <Text strong>Environment Variables:</Text>
                    <pre style={{ 
                      backgroundColor: "#f5f5f5", 
                      padding: "12px", 
                      borderRadius: "4px",
                      overflow: "auto",
                      marginTop: "8px"
                    }}>
                      {JSON.stringify(record.definition.environment, null, 2)}
                    </pre>
                  </>
                )}
              </>
            ) : (
              <Text type="secondary">No task definition provided</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={12}>
          <Card title="Input Schema">
            {record?.definition?.inputSchema ? (
              <pre style={{ 
                backgroundColor: "#f5f5f5", 
                padding: "12px", 
                borderRadius: "4px",
                overflow: "auto"
              }}>
                {JSON.stringify(record.definition.inputSchema, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">No input schema defined</Text>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Output Schema">
            {record?.definition?.outputSchema ? (
              <pre style={{ 
                backgroundColor: "#f5f5f5", 
                padding: "12px", 
                borderRadius: "4px",
                overflow: "auto"
              }}>
                {JSON.stringify(record.definition.outputSchema, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">No output schema defined</Text>
            )}
          </Card>
        </Col>
      </Row>
    </Show>
  );
};