"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import API from "@/services/api";
import { Loader2, Shield, User } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"MEMBER" | "ADMIN">(
    "MEMBER",
  );
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: selectedRole, // Passes the selected role back to the Express controller
          };

      const { data } = await API.post(endpoint, payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Authenticated Successfully", {
        description: `Welcome back, ${data.user.name}.`,
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description:
          error.response?.data?.message ||
          "An unresolved interface exception occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F9FAFB]">
      <Card className="w-full max-w-md border border-gray-200/80 shadow-sm bg-white rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
            {isLogin ? "Welcome back" : "Create an workspace account"}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {isLogin
              ? "Enter your credentials to access your task terminal"
              : "Sign up below to initialize team pipelines"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="border-gray-200 focus-visible:ring-gray-950 h-10"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Aesthetic Role Toggle Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">
                    Account Access Tier
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("MEMBER")}
                      className={`flex items-center justify-center p-3 text-xs font-medium border rounded-xl transition-all ${
                        selectedRole === "MEMBER"
                          ? "border-gray-950 bg-gray-50 text-gray-900 ring-1 ring-gray-950"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <User className="mr-2 h-3.5 w-3.5" />
                      Member Tier
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("ADMIN")}
                      className={`flex items-center justify-center p-3 text-xs font-medium border rounded-xl transition-all ${
                        selectedRole === "ADMIN"
                          ? "border-gray-950 bg-gray-50 text-gray-900 ring-1 ring-gray-950"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Shield className="mr-2 h-3.5 w-3.5" />
                      Admin Privilege
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-gray-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="border-gray-200 focus-visible:ring-gray-950 h-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-200 focus-visible:ring-gray-950 h-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gray-950 hover:bg-gray-900 text-white transition-colors h-10 rounded-xl"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Register Profile"}
            </Button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors mx-auto underline underline-offset-4"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
