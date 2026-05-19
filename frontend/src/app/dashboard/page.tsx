"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Circle,
  Activity,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import API from "@/services/api";
import { toast } from "sonner";

interface Metrics {
  totalTasks: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export default function OverviewTerminal() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        const { data } = await API.get("/tasks/dashboard/stats");
        setMetrics(data.metrics);
      } catch (error: any) {
        toast.error("Failed to load ecosystem analytics layer.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Backlog Tasks",
      value: metrics?.todo || 0,
      icon: Circle,
      color: "text-gray-400",
    },
    {
      title: "Active Builds",
      value: metrics?.inProgress || 0,
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Completed Actions",
      value: metrics?.done || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Overdue Thresholds",
      value: metrics?.overdue || 0,
      icon: AlertCircle,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center">
          <LayoutDashboard className="mr-2 h-5 w-5 text-gray-500" /> Dashboard
          Overview Terminal
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time metrics tracking operational task velocity across assigned
          instances.
        </p>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Card
            key={idx}
            className="border border-gray-200/60 shadow-none bg-white rounded-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight text-gray-900">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informative placeholder text for clean aesthetics */}
      <Card className="border border-dashed border-gray-200 bg-gray-50/50 rounded-xl shadow-none p-6 text-center">
        <p className="text-xs text-gray-400">
          Navigate to the{" "}
          <span className="font-semibold text-gray-600">Projects & Teams</span>{" "}
          tab to view isolated tasks boards, create milestones, or manage role
          permissions.
        </p>
      </Card>
    </div>
  );
}
