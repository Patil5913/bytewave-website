import { draftMode } from "next/headers";

export default async function PreviewBanner({ path }: { path?: string }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-brand px-6 py-2 text-sm text-canvas">
      <span className="font-medium">
        Draft preview — this includes unpublished changes.
      </span>
      {/* A form, not a link: a prefetched <Link> would exit preview on hover. */}
      <form
        method="POST"
        action={`/preview/exit${path ? `?path=${encodeURIComponent(path)}` : ""}`}
      >
        <button
          type="submit"
          className="underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Exit preview
        </button>
      </form>
    </div>
  );
}
