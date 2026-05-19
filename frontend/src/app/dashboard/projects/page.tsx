"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Folder, Users, Calendar, Loader2 } from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: { id: string; name: string }[];
  _count?: { tasks: number };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("MEMBER");

  // Form State
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    // Determine user privilege role from local context
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data.data);
    } catch (error: any) {
      toast.error("Failed to sync project directory.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setCreateLoading(true);
    try {
      await API.post("/projects", {
        name: projectName,
        description: projectDescription,
      });

      toast.success("Project initialized successfully");
      setProjectName("");
      setProjectDescription("");
      setIsDialogOpen(false);
      fetchProjects(); // Refresh index layout view
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create project pipeline.",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section displaying actions conditionally based on tier role */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center">
            <Folder className="mr-2 h-5 w-5 text-gray-500" /> Projects Directory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Initialize standalone scopes, cluster tasks workflows, and view
            authorized team instances.
          </p>
        </div>

        {userRole === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-950 hover:bg-gray-900 text-white rounded-xl text-xs h-10 px-4 transition-colors">
                <Plus className="mr-1.5 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 rounded-2xl bg-white border border-gray-100">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  Create Project Scope
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Fill in parameters below to instantiate a new shared space
                  workspace environment.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pName"
                    className="text-xs font-medium text-gray-700"
                  >
                    Project Identifier Name
                  </Label>
                  <Input
                    id="pName"
                    placeholder="e.g., Core Engine Migration"
                    className="border-gray-200 focus-visible:ring-gray-950 h-10"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pDesc"
                    className="text-xs font-medium text-gray-700"
                  >
                    Scope Description
                  </Label>
                  <Input
                    id="pDesc"
                    placeholder="Brief description of project operational intent"
                    className="border-gray-200 focus-visible:ring-gray-950 h-10"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gray-950 text-white hover:bg-gray-900 h-10 rounded-xl px-4 text-xs"
                    disabled={createLoading}
                  >
                    {createLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Deploy Pipeline
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Projects Grid Grid Layout System */}
      {projects.length === 0 ? (
        <Card className="border border-dashed border-gray-200 bg-gray-50/50 rounded-xl shadow-none p-12 text-center">
          <Folder className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">
            No active environments found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {userRole === "ADMIN"
              ? "Initialize a new pipeline using the trigger button."
              : "You are currently not assigned to any project ecosystems."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border border-gray-200/60 shadow-none bg-white rounded-xl hover:border-gray-300 transition-all"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {project.description ||
                    "No baseline metadata parameters provided for this environment."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 border-t border-gray-50 mt-2 px-6 py-4 flex items-center justify-between text-gray-400 text-[11px] font-medium">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Users className="mr-1 h-3.5 w-3.5 text-gray-400" />
                    {project.members?.length || 0} Members
                  </span>
                  <span className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-gray-400" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-900 font-semibold bg-gray-100/80 px-2.5 py-0.5 rounded-full text-[10px]">
                  {project._count?.tasks || 0} Tasks Active
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
