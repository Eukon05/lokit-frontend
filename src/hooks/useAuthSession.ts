import { useContext } from "react";
import { AuthSessionContext } from "../contexts/AuthSessionContext";

function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (ctx === null) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return ctx;
}

export default useAuthSession;