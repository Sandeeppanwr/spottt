import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";

export function useStoreUser() {
  const { isAuthenticated: isConvexAuth, isLoading: isConvexLoading } = useConvexAuth();
  const { user, isLoaded: isClerkLoaded } = useUser();

  const storeUser = useMutation(api.users.store);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Clerk load ना हो, WAIT करो
    if (!isClerkLoaded) return;

    // User login नहीं है, कुछ मत करो
    if (!isConvexAuth || !user) return;

    async function save() {
      const id = await storeUser();
      setUserId(id);
    }

    save();
  }, [isClerkLoaded, isConvexAuth, user?.id]);

  return {
    isLoading: isConvexLoading || (isConvexAuth && userId === null),
    isAuthenticated: isConvexAuth && userId !== null,
  };
}
