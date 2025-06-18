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
  DeleteButton,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Switch, Typography, Tag, Alert, Button } from "antd";
import { Schedule } from "../../types/ratchet";

const { Text } = Typography;

export const ScheduleList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { tableProps } = useTable<Schedule>({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <List>
      <Table {...safeTableProps} rowKey="id">
        <Table.Column dataIndex="id" title={translate("schedules.fields.id")} />
        <Table.Column
          dataIndex="name"
          title={translate("schedules.fields.name")}
          render={(value: string) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex="description"
          title={translate("schedules.fields.description")}
          render={(value: string) => (
            <Text ellipsis={{ tooltip: value }}>
              {value || "No description"}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="cronExpression"
          title={translate("schedules.fields.cronExpression")}
          render={(value: string) => <Tag color="purple">{value}</Tag>}
        />
        <Table.Column
          dataIndex="enabled"
          title={translate("schedules.fields.enabled")}
          render={(value: boolean) => (
            <Switch checked={value} disabled size="small" />
          )}
        />
        <Table.Column
          dataIndex="taskId"
          title={translate("schedules.fields.taskId")}
          render={(value: string) => <Tag color="blue">{value}</Tag>}
        />
        <Table.Column
          dataIndex="nextRun"
          title={translate("schedules.fields.nextRun")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "Not scheduled"
          }
        />
        <Table.Column
          dataIndex="lastRun"
          title={translate("schedules.fields.lastRun")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "Never"
          }
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};