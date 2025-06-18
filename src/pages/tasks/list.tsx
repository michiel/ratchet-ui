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
import { Table, Space, Switch, Typography, Tag, Alert } from "antd";
import { Task } from "../../types/ratchet";

const { Text } = Typography;

export const TaskList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { tableProps } = useTable<Task>({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <List>
      <Table {...safeTableProps} rowKey="id">
        <Table.Column dataIndex="id" title={translate("tasks.fields.id")} />
        <Table.Column
          dataIndex="name"
          title={translate("tasks.fields.name")}
          render={(value: string) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex="version"
          title={translate("tasks.fields.version")}
          render={(value: string) => <Tag color="blue">{value}</Tag>}
        />
        <Table.Column
          dataIndex="description"
          title={translate("tasks.fields.description")}
          render={(value: string) => (
            <Text ellipsis={{ tooltip: value }}>
              {value || "No description"}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="enabled"
          title={translate("tasks.fields.enabled")}
          render={(value: boolean) => (
            <Switch checked={value} disabled size="small" />
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title={translate("tasks.fields.createdAt")}
          render={(value: string) => 
            value ? new Date(value).toLocaleString() : "N/A"
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