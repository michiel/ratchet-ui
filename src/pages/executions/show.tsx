import React, { useState } from "react";
import { IResourceComponentsProps, useShow, useCustomMutation, useNotification } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Tag, Progress, Divider, Button, Space, Modal } from "antd";
import { PlayCircleOutlined, StopOutlined, RedoOutlined, FileTextOutlined } from "@ant-design/icons";
import { Execution, ExecutionStatus } from "../../types/ratchet";
import { ExecutionLogsModal } from "../../components/ExecutionLogsModal";

const { Title, Text, Paragraph } = Typography;

const getStatusColor = (status: ExecutionStatus) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'failed':
      return 'red';
    case 'running':
      return 'blue';
    case 'pending':
      return 'orange';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

export const ExecutionShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<Execution>();
  const { data, isLoading } = queryResult;
  const { open } = useNotification();
  const [logsModalVisible, setLogsModalVisible] = useState(false);

  const record = data?.data;

  const { mutate: cancelExecution } = useCustomMutation();

  const { mutate: retryExecution } = useCustomMutation();

  const handleCancel = () => {
    if (!record?.id) return;
    
    Modal.confirm({
      title: 'Cancel Execution',
      content: 'Are you sure you want to cancel this execution?',
      onOk: () => {
        cancelExecution({
          url: `http://localhost:8080/api/v1/executions/${record.id}/cancel`,
          method: "post",
          values: {},
        }, {
          onSuccess: () => {
            open?.({
              type: "success",
              message: "Execution cancelled successfully",
            });
            window.location.reload();
          },
          onError: (error: any) => {
            open?.({
              type: "error",
              message: "Failed to cancel execution",
              description: error?.message || "Unknown error occurred",
            });
          },
        });
      },
    });
  };

  const handleRetry = () => {
    if (!record?.id) return;

    Modal.confirm({
      title: 'Retry Execution',
      content: 'Are you sure you want to retry this execution?',
      onOk: () => {
        retryExecution({
          url: `http://localhost:8080/api/v1/executions/${record.id}/retry`,
          method: "post",
          values: {},
        }, {
          onSuccess: () => {
            open?.({
              type: "success",
              message: "Execution retry initiated successfully",
            });
            window.location.reload();
          },
          onError: (error: any) => {
            open?.({
              type: "error",
              message: "Failed to retry execution",
              description: error?.message || "Unknown error occurred",
            });
          },
        });
      },
    });
  };

  const handleViewLogs = () => {
    setLogsModalVisible(true);
  };

  return (
    <Show 
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Space>
            {(record?.status === 'running' || record?.status === 'pending') && record?.canCancel && (
              <Button 
                icon={<StopOutlined />} 
                danger
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            {record?.status === 'failed' && record?.canRetry && (
              <Button 
                icon={<RedoOutlined />} 
                onClick={handleRetry}
              >
                Retry
              </Button>
            )}
            <Button 
              icon={<FileTextOutlined />} 
              onClick={handleViewLogs}
            >
              View Logs
            </Button>
          </Space>
        </>
      )}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Execution Details">
            <Title level={4}>Execution {record?.id}</Title>
            <Paragraph>
              <Text strong>Task ID:</Text> <Text code>{record?.taskId}</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text>{" "}
              <Tag color={getStatusColor(record?.status as ExecutionStatus)}>
                {record?.status?.toUpperCase()}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Priority:</Text>{" "}
              <Tag color={record?.priority === 'high' ? 'red' : record?.priority === 'urgent' ? 'magenta' : 'default'}>
                {record?.priority || 'normal'}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>Progress:</Text>
              <br />
              <Progress 
                percent={record?.progress || 0} 
                status={record?.progress === 100 ? "success" : record?.status === 'failed' ? "exception" : "active"}
              />
            </Paragraph>
            <Paragraph>
              <Text strong>Started:</Text>{" "}
              {record?.startedAt ? new Date(record.startedAt).toLocaleString() : "Not started"}
            </Paragraph>
            <Paragraph>
              <Text strong>Completed:</Text>{" "}
              {record?.completedAt ? new Date(record.completedAt).toLocaleString() : "Not completed"}
            </Paragraph>
            <Paragraph>
              <Text strong>Duration:</Text>{" "}
              {record?.duration ? `${Math.round(record.duration / 1000)}s` : "N/A"}
            </Paragraph>
            <Paragraph>
              <Text strong>Scheduled For:</Text>{" "}
              {record?.scheduledFor ? new Date(record.scheduledFor).toLocaleString() : "Immediate"}
            </Paragraph>
          </Card>
        </Col>

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
      </Row>

      <Divider />

      <Row gutter={24}>
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
              <Text type="secondary">
                {record?.status === 'completed' ? 'No output data' : 'Execution not completed'}
              </Text>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Error Information">
            {record?.errorMessage ? (
              <>
                <Paragraph>
                  <Text strong>Error Message:</Text>
                  <br />
                  <Text type="danger">{record.errorMessage}</Text>
                </Paragraph>
                {record.errorDetails && (
                  <>
                    <Text strong>Error Details:</Text>
                    <pre style={{ 
                      backgroundColor: "#fff2f0", 
                      padding: "12px", 
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: "200px",
                      border: "1px solid #ffccc7"
                    }}>
                      {JSON.stringify(record.errorDetails, null, 2)}
                    </pre>
                  </>
                )}
              </>
            ) : (
              <Text type="secondary">No errors</Text>
            )}
          </Card>
        </Col>
      </Row>

      {record?.id && (
        <ExecutionLogsModal
          executionId={record.id}
          visible={logsModalVisible}
          onClose={() => setLogsModalVisible(false)}
        />
      )}
    </Show>
  );
};