"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@prisma/client";

type CurrentUserData = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
};

export function useCurrentUser(): CurrentUserData {
  // Authentication disabled for frontend design purposes
  // Return mock user data
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  // Mock user for design purposes
  const mockUser = {
    id: "mock-user-id",
    email: "demo@boringautomation.com",
    user_metadata: {
      full_name: "Demo User",
    },
  } as unknown as User;

  const mockProfile = {
    id: "mock-profile-id",
    userId: "mock-user-id",
    firstName: "Demo",
    lastName: "User",
    avatarUrl: null,
    role: "USER",
  } as unknown as Profile;

  return {
    user: mockUser,
    profile: mockProfile,
    isLoading,
    error,
    refetch: async () => {},
  };
}
