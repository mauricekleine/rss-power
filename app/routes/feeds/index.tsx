import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      <span>No feed selected. Select a feed on the left, or </span>

      <Link to="new" className="text-blue-500 underline">
        add a new feed.
      </Link>
    </p>
  );
}
