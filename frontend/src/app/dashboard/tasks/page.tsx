"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  CheckSquare,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string;
  projectId: string;
  assigneeId: string | null;
}

interface Project {
  id: string;
  name: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("MEMBER");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
    fetchEcosystemData();
  }, []);

  const fetchEcosystemData = async () => {
    try {
      const projectsRes = await API.get("/projects");
      setProjects(projectsRes.data.data);

      const tasksRes = await API.get("/tasks");
      setTasks(tasksRes.data.data || []);
    } catch (error) {
      toast.error("Failed to synchronize kanban board parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProjectId) return;

    setActionLoading(true);
    try {
      await API.post("/tasks", {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        projectId: selectedProjectId,
      });

      toast.success("Task pipeline assigned successfully");
      setTitle("");
      setDescription("");
      setDueDate("");
      setIsDialogOpen(false);
      fetchEcosystemData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to inject task build.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdvanceStatus = async (
    taskId: string,
    currentStatus: "TODO" | "IN_PROGRESS" | "DONE",
  ) => {
    const nextStatusMap: Record<string, "TODO" | "IN_PROGRESS" | "DONE"> = {
      TODO: "IN_PROGRESS",
      IN_PROGRESS: "DONE",
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      await API.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      toast.success(`Progressed task state to ${nextStatus}`);
      fetchEcosystemData();
    } catch (error) {
      toast.error("Could not transition task lifecycle phase.");
    }
  };

  const columns: {
    id: "TODO" | "IN_PROGRESS" | "DONE";
    label: string;
    bg: string;
  }[] = [
    { id: "TODO", label: "Backlog / Queue", bg: "bg-gray-100/60" },
    { id: "IN_PROGRESS", label: "Active Execution", bg: "bg-blue-50/40" },
    { id: "DONE", label: "Deployed / Finished", bg: "bg-emerald-50/40" },
  ];

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-gray-400">
        Loading Kanban Clusters...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center">
            <CheckSquare className="mr-2 h-5 w-5 text-gray-500" /> Operational
            Kanban Board
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track operational milestones, lifecycle status, and sprint
            completion metrics.
          </p>
        </div>

        {userRole === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-950 text-white hover:bg-gray-900 rounded-xl text-xs h-10 px-4">
                <Plus className="mr-1.5 h-4 w-4" /> Create Task Instance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 rounded-2xl bg-white border border-gray-100">
              <DialogHeader>
                <DialogTitle className="text-sm font-semibold tracking-tight">
                  Generate Task Target
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Fill in standard parameters to assign standalone features to
                  scope environments.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tTitle"
                    className="text-xs font-medium text-gray-700"
                  >
                    Task Title
                  </Label>
                  <Input
                    id="tTitle"
                    placeholder="e.g., Fix Memory Leak in API Layer"
                    className="border-gray-200 focus-visible:ring-gray-950 h-10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tDesc"
                    className="text-xs font-medium text-gray-700"
                  >
                    Action Details
                  </Label>
                  <Input
                    id="tDesc"
                    placeholder="Detailed steps for implementation..."
                    className="border-gray-200 focus-visible:ring-gray-950 h-10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tProject"
                    className="text-xs font-medium text-gray-700"
                  >
                    Target Workspace Scope
                  </Label>
                  <select
                    id="tProject"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-950 bg-white"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                  >
                    <option value="">Select Target Pipeline...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tDate"
                    className="text-xs font-medium text-gray-700"
                  >
                    Due Date Timeline
                  </Label>
                  <Input
                    id="tDate"
                    type="date"
                    className="border-gray-200 focus-visible:ring-gray-950 h-10 text-xs"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-gray-950 text-white text-xs h-10 rounded-xl"
                    disabled={actionLoading}
                  >
                    {actionLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Deploy Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`p-4 rounded-2xl border border-gray-200/50 ${col.bg} min-h-125 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {col.label}
                </span>
                <span className="text-[11px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-28 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[11px] text-gray-400 bg-white/50">
                    No active tokens in this phase
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border border-gray-200/70 shadow-none bg-white rounded-xl hover:border-gray-300 transition-all group"
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-900 leading-tight">
                          {task.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3">
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          {task.description ||
                            "No supplemental details documented."}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                          <span className="flex items-center text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>

                          {col.id !== "DONE" && (
                            <button
                              onClick={() =>
                                handleAdvanceStatus(task.id, task.status)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-all flex items-center text-gray-900 hover:text-blue-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded"
                            >
                              Advance <ArrowRight className="ml-1 h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
