import React, { useEffect, useCallback } from "react";
import { useBeforeUnload, UNSAFE_NavigationContext } from "react-router";

interface NavigationPromptProps {
  when: boolean;
  message?: string;
  resetImage?: () => void;
  resetForm?: () => void;
}

export const NavigationPrompt = ({
  when,
  message = "You have unsaved changes. Are you sure you want to leave this page?",
  resetImage,
  resetForm,
}: NavigationPromptProps) => {
  const { navigator } = React.useContext(UNSAFE_NavigationContext);

  // Reset function to handle both resetImage and resetForm
  const handleReset = useCallback(() => {
    resetImage?.();
    resetForm?.();
  }, [resetImage, resetForm]);

  // Routes allowed to bypass the confirmation
  const allowedRoutePrefix = "/organizer/events/new/";

  const shouldBypassPrompt = (targetPath: string) => {
    return targetPath.startsWith(allowedRoutePrefix);
  };

  // Warn on browser refresh/close
  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault();
          event.returnValue = message;
          return message;
        }
      },
      [when, message]
    )
  );

  // Trigger reset when the page is unloaded
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (when) {
        handleReset();
      }
    };

    window.addEventListener("unload", handleBeforeUnload);
    return () => {
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, [when, handleReset]);

  // Handle React Router navigation
  useEffect(() => {
    if (!when) return;

    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    navigator.push = (location, state) => {
      const targetPath =
        typeof location === "string" ? location : location.pathname || "";
      if (shouldBypassPrompt(targetPath)) {
        return originalPush(location, state);
      }

      const result = window.confirm(message);
      if (result) {
        handleReset();
        return originalPush(location, state);
      }
      return false;
    };

    navigator.replace = (location, state) => {
      const targetPath =
        typeof location === "string" ? location : location.pathname || "";
      if (shouldBypassPrompt(targetPath)) {
        return originalReplace(location, state);
      }

      const result = window.confirm(message);
      if (result) {
        handleReset();
        return originalReplace(location, state);
      }
      return false;
    };

    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [when, message, navigator, handleReset]);

  return null;
};
