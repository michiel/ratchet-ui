import React from "react";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Typography, Card, Row, Col } from "antd";
import { CreateExecutionRequest, Task } from "../../types/ratchet";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

export const ExecutionCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm<CreateExecutionRequest>();
  
  // Fetch available tasks for the dropdown
  const { data: tasksData } = useList<Task>({
    resource: "tasks",
    pagination: { pageSize: 100 },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Execution Details">
              <Form.Item
                label="Task"
                name="taskId"
                rules={[
                  { required: true, message: "Task is required" },
                ]}
              >
                <Select
                  placeholder="Select a task to execute"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                  }
                >
                  {tasksData?.data?.map((task) => (
                    <Option key={task.id} value={task.id}>
                      {task.name} (v{task.version})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
                initialValue="normal"
              >
                <Select>
                  <Option value="low">Low</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Scheduled For (Optional)"
                name="scheduledFor"
              >
                <DatePicker 
                  showTime 
                  placeholder="Leave empty to execute immediately"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Input Data">
              <Form.Item
                label="Input (JSON)"
                name="input"
                rules={[
                  { required: true, message: "Input data is required" },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        try {
                          JSON.parse(value);
                        } catch (e) {
                          throw new Error('Input must be valid JSON');
                        }
                      }
                    },
                  },
                ]}
              >
                <TextArea
                  rows={12}
                  placeholder={`{
  "filename": "data.csv",
  "format": "csv",
  "validateOnly": false
}`}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};