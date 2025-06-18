import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  useTranslate,
  useCustomMutation,
  useNotification,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Tag, Progress, Button, Typography, Alert, Modal } from "antd";
import { PlayCircleOutlined, StopOutlined, RedoOutlined, FileTextOutlined } from "@ant-design/icons";
import { Execution, ExecutionStatus } from "../../types/ratchet";
import { ExecutionLogsModal } from "../../components/ExecutionLogsModal";

const { Text } = Typography;

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

export const ExecutionList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { open } = useNotification();
  const [logsModalVisible, setLogsModalVisible] = React.useState(false);
  const [selectedExecutionId, setSelectedExecutionId] = React.useState<string>("");
  const tableResult = useTable<Execution>({
    syncWithLocation: true,
  });
  const { tableProps } = tableResult;

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps.dataSource) ? tableProps.dataSource : [],
  };

  const { mutate: cancelExecution } = useCustomMutation();

  const { mutate: retryExecution } = useCustomMutation();

  const handleCancel = (executionId: string) => {
    Modal.confirm({
      title: 'Cancel Execution',
      content: 'Are you sure you want to cancel this execution?',
      onOk: () => {
        cancelExecution({
          url: `http://localhost:8080/api/v1/executions/${executionId}/cancel`,
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

  const handleRetry = (executionId: string) => {
    Modal.confirm({
      title: 'Retry Execution',
      content: 'Are you sure you want to retry this execution?',
      onOk: () => {
        retryExecution({
          url: `http://localhost:8080/api/v1/executions/${executionId}/retry`,
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

  const handleViewLogs = (executionId: string) => {
    setSelectedExecutionId(executionId);
    setLogsModalVisible(true);
  };

  return (
    <List>
      <Table {...safeTableProps} rowKey="id">
        <Table.Column dataIndex="id" title={translate("executions.fields.id")} />
        <Table.Column
          dataIndex="taskId"
          title={translate("executions.fields.taskId")}
          render={(value: string) => <Text code>{value}</Text>}
        />
        <Table.Column
          dataIndex="status"
          title={translate("executions.fields.status")}
          render={(value: ExecutionStatus) => (
            <Tag color={getStatusColor(value)}>{value.toUpperCase()}</Tag>
          )}
        />
        <Table.Column
          dataIndex="progress"
          title={translate("executions.fields.progress")}
          render={(value: number) => (
            <Progress 
              percent={value || 0} 
              size="small" 
              status={value === 100 ? "success" : "active"}
            />
          )}
        />
        <Table.Column
          dataIndex="priority"
          title={translate("executions.fields.priority")}
          render={(value: string) => (
            <Tag color={value === 'high' ? 'red' : value === 'urgent' ? 'magenta' : 'default'}>
              {value || 'normal'}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="startedAt"
          title={translate("executions.fields.startedAt")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "Not started"
          }
        />
        <Table.Column
          dataIndex="duration"
          title={translate("executions.fields.duration")}
          render={(value: number) => 
            value ? `${Math.round(value / 1000)}s` : "N/A"
          }
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              {(record.status === 'running' || record.status === 'pending') && record.canCancel && (
                <Button 
                  size="small" 
                  icon={<StopOutlined />} 
                  danger
                  title="Cancel execution"
                  onClick={() => handleCancel(String(record.id))}
                />
              )}
              {record.status === 'failed' && record.canRetry && (
                <Button 
                  size="small" 
                  icon={<RedoOutlined />} 
                  title="Retry execution"
                  onClick={() => handleRetry(String(record.id))}
                />
              )}
              <Button 
                size="small" 
                icon={<FileTextOutlined />} 
                title="View logs"
                onClick={() => handleViewLogs(String(record.id))}
              />
            </Space>
          )}
        />
      </Table>

      {selectedExecutionId && (
        <ExecutionLogsModal
          executionId={selectedExecutionId}
          visible={logsModalVisible}
          onClose={() => {
            setLogsModalVisible(false);
            setSelectedExecutionId("");
          }}
        />
      )}
    </List>
  );
};