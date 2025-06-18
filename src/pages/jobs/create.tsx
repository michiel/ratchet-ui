import React from "react";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Card, Row, Col, InputNumber, DatePicker } from "antd";
import { CreateJobRequest, JobPriority, Task } from "../../types/ratchet";

const { TextArea } = Input;

export const JobCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm<CreateJobRequest>();

  // Fetch available tasks for the task selector
  const { data: tasksData } = useList<Task>({
    resource: "tasks",
  });

  const priorityOptions = [
    { label: "Low", value: "LOW" as JobPriority },
    { label: "Normal", value: "NORMAL" as JobPriority },
    { label: "High", value: "HIGH" as JobPriority },
    { label: "Critical", value: "CRITICAL" as JobPriority },
  ];

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Job Configuration">
              <Form.Item
                label="Task"
                name="taskId"
                rules={[
                  { required: true, message: "Task selection is required" },
                ]}
              >
                <Select
                  placeholder="Select a task to execute"
                  showSearch
                  optionFilterProp="children"
                >
                  {tasksData?.data?.map((task) => (
                    <Select.Option key={task.id} value={task.id}>
                      {task.name} (v{task.version})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
                initialValue="NORMAL"
              >
                <Select options={priorityOptions} />
              </Form.Item>

              <Form.Item
                label="Max Retries"
                name="maxRetries"
                initialValue={3}
                rules={[
                  { type: "number", min: 0, max: 10, message: "Must be between 0 and 10" },
                ]}
              >
                <InputNumber min={0} max={10} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Scheduled For"
                name="scheduledFor"
              >
                <DatePicker 
                  showTime 
                  style={{ width: "100%" }}
                  placeholder="Leave empty to execute immediately"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Input Data">
              <Form.Item
                label="Input JSON"
                name="input"
                rules={[
                  { required: true, message: "Input data is required" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      try {
                        JSON.parse(value);
                        return Promise.resolve();
                      } catch {
                        return Promise.reject(new Error("Must be valid JSON"));
                      }
                    }
                  }
                ]}
              >
                <TextArea
                  rows={12}
                  placeholder={`{
  "key": "value",
  "parameters": {
    "setting": true
  }
}`}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="Output Destinations (Optional)" style={{ marginTop: 24 }}>
          <Form.Item
            label="Output Destinations (JSON)"
            name="outputDestinations"
          >
            <TextArea
              rows={6}
              placeholder={`[
  {
    "type": "webhook",
    "url": "https://api.example.com/webhook",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
]`}
            />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};