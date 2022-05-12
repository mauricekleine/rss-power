import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

type Props = {
  text: string;
};

export default function SanitizedText({ text }: Props) {
  const sanitzed = useMemo(() => {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // strip all HTML from an item's description
    });
  }, [text]);

  return <>{sanitzed}</>;
}
