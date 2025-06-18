import React from "react";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Card, Row, Col, InputNumber, DatePicker } from "antd";
import { UpdateJobRequest, JobPriority, JobStatus, Task } from "../../types/ratchet";
import dayjs from "dayjs";

const { TextArea } = Input;

export const JobEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<UpdateJobRequest>();

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

  const statusOptions = [
    { label: "Queued", value: "QUEUED" as JobStatus },
    { label: "Processing", value: "PROCESSING" as JobStatus },
    { label: "Completed", value: "COMPLETED" as JobStatus },
    { label: "Failed", value: "FAILED" as JobStatus },
    { label: "Cancelled", value: "CANCELLED" as JobStatus },
    { label: "Retrying", value: "RETRYING" as JobStatus },
  ];

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Job Configuration">
              <Form.Item
                label="Status"
                name="status"
              >
                <Select options={statusOptions} />
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
              >
                <Select options={priorityOptions} />
              </Form.Item>

              <Form.Item
                label="Max Retries"
                name="maxRetries"
                rules={[
                  { type: "number", min: 0, max: 10, message: "Must be between 0 and 10" },
                ]}
              >
                <InputNumber min={0} max={10} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Scheduled For"
                name="scheduledFor"
                getValueProps={(value) => ({
                  value: value ? dayjs(value) : undefined,
                })}
                normalize={(value) => value?.toISOString()}
              >
                <DatePicker 
                  showTime 
                  style={{ width: "100%" }}
                  placeholder="Leave empty for immediate execution"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Error Information">
              <Form.Item
                label="Error Message"
                name="errorMessage"
              >
                <TextArea
                  rows={4}
                  placeholder="Error message (if any)"
                  readOnly
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};