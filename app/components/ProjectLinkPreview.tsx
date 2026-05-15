function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface ProjectLinkPreviewProps {
  url: string;
}

export function ProjectLinkPreview({ url }: ProjectLinkPreviewProps) {
  const hostname = getHostname(url);

  return (
    <div className="flex h-40 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-neutral-200/80 bg-neutral-100 px-3 py-1 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex shrink-0 gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-red-400/90" />
          <span className="size-2 rounded-full bg-amber-400/90" />
          <span className="size-2 rounded-full bg-emerald-400/90" />
        </div>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {hostname}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        <iframe
          src={url}
          title={`Aperçu de ${hostname}`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 border-0"
          style={{
            width: "400%",
            height: "400%",
            transform: "scale(0.25)",
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
}
