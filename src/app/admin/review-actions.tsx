"use client";

import { useState, useTransition } from "react";
import { approveCompany, requestRevision } from "./actions";

export default function ReviewActions({ companyId }: { companyId: string }) {
  const [pending, startTransition] = useTransition();
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

  if (showNoteInput) {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          className="w-48 rounded-md border border-neutral-300 p-1.5 text-xs"
          placeholder="What needs fixing?"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex gap-1.5">
          <button
            disabled={!note.trim() || pending}
            onClick={() =>
              startTransition(async () => {
                await requestRevision(companyId, note.trim());
                setShowNoteInput(false);
                setNote("");
              })
            }
            className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
          <button
            onClick={() => setShowNoteInput(false)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      <button
        disabled={pending}
        onClick={() => startTransition(() => approveCompany(companyId))}
        className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
      >
        Approve
      </button>
      <button
        disabled={pending}
        onClick={() => setShowNoteInput(true)}
        className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700"
      >
        Needs revision
      </button>
    </div>
  );
}
