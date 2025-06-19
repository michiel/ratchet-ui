import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { createRatchetDataProvider } from "./dataProvider";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { TaskList, TaskCreate, TaskEdit, TaskShow } from "./pages/tasks";
import { ExecutionList, ExecutionCreate, ExecutionShow } from "./pages/executions";
import { JobList, JobCreate, JobEdit, JobShow } from "./pages/jobs";
import { ScheduleList, ScheduleCreate, ScheduleEdit, ScheduleShow } from "./pages/schedules";

// Configure API URL based on environment
const getApiUrl = (): string => {
  // In production (when served from CDN), use relative path
  if (import.meta.env.PROD) {
    return "/api/v1";
  }
  
  // In development, use full localhost URL
  return "http://localhost:8080/api/v1";
};

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={createRatchetDataProvider(getApiUrl())}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "tasks",
                    list: "/tasks",
                    create: "/tasks/create",
                    edit: "/tasks/edit/:id",
                    show: "/tasks/show/:id",
                    meta: {
                      canDelete: false,
                      icon: "🔧",
                    },
                  },
                  {
                    name: "executions",
                    list: "/executions",
                    create: "/executions/create",
                    edit: "/executions/edit/:id",
                    show: "/executions/show/:id",
                    meta: {
                      canDelete: false,
                      icon: "▶️",
                    },
                  },
                  {
                    name: "jobs",
                    list: "/jobs",
                    create: "/jobs/create",
                    edit: "/jobs/edit/:id",
                    show: "/jobs/show/:id",
                    meta: {
                      canDelete: false,
                      icon: "📋",
                    },
                  },
                  {
                    name: "schedules",
                    list: "/schedules",
                    create: "/schedules/create",
                    edit: "/schedules/edit/:id",
                    show: "/schedules/show/:id",
                    meta: {
                      canDelete: true,
                      icon: "⏰",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "BkTP2S-iwXjIA-qrq1TM",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="tasks" />}
                    />
                    <Route path="/tasks">
                      <Route index element={<TaskList />} />
                      <Route path="create" element={<TaskCreate />} />
                      <Route path="edit/:id" element={<TaskEdit />} />
                      <Route path="show/:id" element={<TaskShow />} />
                    </Route>
                    <Route path="/executions">
                      <Route index element={<ExecutionList />} />
                      <Route path="create" element={<ExecutionCreate />} />
                      <Route path="edit/:id" element={<div>Edit Execution - Coming Soon</div>} />
                      <Route path="show/:id" element={<ExecutionShow />} />
                    </Route>
                    <Route path="/jobs">
                      <Route index element={<JobList />} />
                      <Route path="create" element={<JobCreate />} />
                      <Route path="edit/:id" element={<JobEdit />} />
                      <Route path="show/:id" element={<JobShow />} />
                    </Route>
                    <Route path="/schedules">
                      <Route index element={<ScheduleList />} />
                      <Route path="create" element={<ScheduleCreate />} />
                      <Route path="edit/:id" element={<ScheduleEdit />} />
                      <Route path="show/:id" element={<ScheduleShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
