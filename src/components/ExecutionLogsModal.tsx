import React, { useState, useEffect } from "react";
import { Modal, Typography, Spin, Alert, Button } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCustomMutation } from "@refinedev/core";

const { Text } = Typography;

interface ExecutionLogsModalProps {
  executionId: string;
  visible: boolean;
  onClose: () => void;
}

export const ExecutionLogsModal: React.FC<ExecutionLogsModalProps> = ({
  executionId,
  visible,
  onClose,
}) => {
  const [logs, setLogs] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: fetchLogs } = useCustomMutation();

  const loadLogs = () => {
    setIsLoading(true);
    setError(null);
    
    fetchLogs({
      url: `http://localhost:8080/api/v1/executions/${executionId}/logs`,
      method: "post",
      values: {},
    }, {
      onSuccess: (data: any) => {
        setLogs(data.data?.logs || "No logs available");
        setIsLoading(false);
      },
      onError: (error: any) => {
        setError(error?.message || "Failed to fetch logs");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (visible && executionId) {
      loadLogs();
    }
  }, [visible, executionId]);

  const handleDownload = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `execution-${executionId}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      title={`Execution Logs - ${executionId}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload}>
          Download
        </Button>,
        <Button key="refresh" icon={<ReloadOutlined />} onClick={loadLogs}>
          Refresh
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading logs...</Text>
          </div>
        </div>
      ) : error ? (
        <Alert
          message="Error loading logs"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={loadLogs}>
              Retry
            </Button>
          }
        />
      ) : (
        <div
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "16px",
            borderRadius: "4px",
            fontFamily: "Monaco, Consolas, 'Courier New', monospace",
            fontSize: "12px",
            lineHeight: "1.4",
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {logs || "No logs available"}
        </div>
      )}
    </Modal>
  );
};