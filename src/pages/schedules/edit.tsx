import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Switch, Typography, Card, Row, Col, Select } from "antd";
import { UpdateScheduleRequest, Task } from "../../types/ratchet";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const ScheduleEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<UpdateScheduleRequest>();

  const { selectProps: taskSelectProps } = useSelect<Task>({
    resource: "tasks",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Basic Information">
              <Form.Item
                label="Schedule Name"
                name="name"
              >
                <Input placeholder="e.g., Daily Report Generation" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe what this schedule does..."
                />
              </Form.Item>

              <Form.Item
                label="Task"
                name="taskId"
              >
                <Select
                  {...taskSelectProps}
                  placeholder="Select a task to schedule"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
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
            <Card title="Schedule Configuration">
              <Form.Item
                label="Cron Expression"
                name="cronExpression"
                help="Format: minute hour day month day-of-week"
              >
                <Input 
                  placeholder="0 9 * * MON-FRI"
                  addonBefore="Cron:"
                />
              </Form.Item>

              <Form.Item
                label="Timezone"
                name="timezone"
                help="IANA timezone identifier (defaults to UTC)"
              >
                <Select
                  placeholder="Select timezone"
                  showSearch
                  options={[
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "America/New_York (EST/EDT)" },
                    { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
                    { value: "America/Denver", label: "America/Denver (MST/MDT)" },
                    { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
                    { value: "Europe/London", label: "Europe/London (GMT/BST)" },
                    { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
                    { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
                    { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
                    { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)" },
                  ]}
                />
              </Form.Item>

              <div style={{ marginBottom: 16 }}>
                <Text strong>Common Cron Patterns:</Text>
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

        <Card title="Task Input" style={{ marginTop: 24 }}>
          <Form.Item
            label="Task Input (JSON)"
            name="taskInput"
          >
            <TextArea
              rows={8}
              placeholder={`{
  "filename": "daily_report.csv",
  "format": "excel",
  "includeHeaders": true
}`}
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};