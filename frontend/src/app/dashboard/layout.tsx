"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Layers,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      toast.error("Access Denied", {
        description: "Please sign in to access your ecosystem console.",
      });
      router.push("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out safely");
    router.push("/auth");
  };

  if (!user) return null; // Prevent layout flashing while validating state

  const navigation = [
    { name: "Overview Terminal", href: "/dashboard", icon: Layers },
    {
      name: "Projects & Teams",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    { name: "Operational Kanban", href: "/dashboard/tasks", icon: CheckSquare }, // 👈 Insert this row entry
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200/80 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-gray-100">
          <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
            Ecosystem
          </span>
          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold tracking-tight bg-gray-100 text-gray-600 rounded">
            {user.role}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                  isActive
                    ? "bg-gray-950 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-gray-950 text-white flex items-center justify-center text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-gray-500 hover:text-red-600 hover:bg-red-50/50 h-9 px-3 rounded-md"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out Workspace
          </Button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE CANVAS --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Banner */}
        <header className="flex md:hidden h-16 items-center justify-between px-4 bg-white border-b border-gray-200">
          <span className="text-xs font-bold uppercase tracking-wider">
            Ecosystem
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </header>

        {/* Mobile Menu Slideout Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 bg-white p-4 space-y-2 animate-in fade-in duration-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <item.icon className="mr-3 h-4 w-4 text-gray-400" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full text-xs h-9"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out Workspace
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
