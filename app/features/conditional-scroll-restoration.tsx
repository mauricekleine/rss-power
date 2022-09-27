import { ScrollRestoration, useLocation } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function ConditionalScrollRestoration() {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  if (
    !isFirstRenderRef.current &&
    location.state !== null &&
    typeof location.state === "object" &&
    (location.state as { scroll: boolean }).scroll === false
  ) {
    return null;
  }

  return <ScrollRestoration />;
}
