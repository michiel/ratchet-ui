import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  useTranslate,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Typography, Tag, Progress, Button } from "antd";
import { Job, JobStatus, JobPriority } from "../../types/ratchet";

const { Text } = Typography;

export const JobList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { tableProps } = useTable<Job>({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps.dataSource) ? tableProps.dataSource : [],
  };

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

  return (
    <List>
      <Table {...safeTableProps} rowKey="id">
        <Table.Column dataIndex="id" title={translate("jobs.fields.id")} width={80} />
        <Table.Column
          dataIndex="taskId"
          title={translate("jobs.fields.taskId")}
          render={(value: string) => <Text code>{value}</Text>}
        />
        <Table.Column
          dataIndex="status"
          title={translate("jobs.fields.status")}
          render={(value: JobStatus) => (
            <Tag color={getStatusColor(value)}>{value}</Tag>
          )}
        />
        <Table.Column
          dataIndex="priority"
          title={translate("jobs.fields.priority")}
          render={(value: JobPriority) => (
            <Tag color={getPriorityColor(value)}>{value}</Tag>
          )}
        />
        <Table.Column
          dataIndex="retryCount"
          title={translate("jobs.fields.retries")}
          render={(retryCount: number, record: Job) => (
            <Text>{retryCount}/{record.maxRetries}</Text>
          )}
          width={80}
        />
        <Table.Column
          dataIndex="queuedAt"
          title={translate("jobs.fields.queuedAt")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "N/A"
          }
        />
        <Table.Column
          dataIndex="startedAt"
          title={translate("jobs.fields.startedAt")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "Not started"
          }
        />
        <Table.Column
          dataIndex="completedAt"
          title={translate("jobs.fields.completedAt")}  
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "Not completed"
          }
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};