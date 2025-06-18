import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Typography, Card, Row, Col } from "antd";
import { UpdateTaskRequest } from "../../types/ratchet";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const TaskEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<UpdateTaskRequest>();

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Basic Information">
              <Form.Item
                label="Task Name"
                name="name"
                rules={[
                  { 
                    pattern: /^[a-zA-Z0-9_-]+$/, 
                    message: "Only alphanumeric characters, hyphens, and underscores allowed" 
                  },
                ]}
              >
                <Input placeholder="e.g., data-processor" />
              </Form.Item>

              <Form.Item
                label="Version"
                name="version"
                rules={[
                  { 
                    pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 
                    message: "Version must follow semantic versioning (e.g., 1.0.0)" 
                  },
                ]}
              >
                <Input placeholder="1.0.0" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe what this task does..."
                />
              </Form.Item>

              <Form.Item
                label="Enabled"
                name="enabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Schema Configuration">
              <Form.Item
                label="Input Schema (JSON)"
                name="inputSchema"
              >
                <TextArea
                  rows={8}
                  placeholder={`{
  "type": "object",
  "properties": {
    "filename": {
      "type": "string"
    }
  },
  "required": ["filename"]
}`}
                />
              </Form.Item>

              <Form.Item
                label="Output Schema (JSON)"
                name="outputSchema"
              >
                <TextArea
                  rows={8}
                  placeholder={`{
  "type": "object",
  "properties": {
    "processedCount": {
      "type": "number"
    }
  }
}`}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="Metadata" style={{ marginTop: 24 }}>
          <Form.Item
            label="Metadata (JSON)"
            name="metadata"
          >
            <TextArea
              rows={4}
              placeholder={`{
  "author": "Development Team",
  "category": "data-processing",
  "tags": ["data", "processing"]
}`}
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};