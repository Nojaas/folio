export type LineSegment = {
  text: string;
  className?: string;
};

const WORD = "split-w";
const SPACE = "split-s";

function wrapWords(container: HTMLElement) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  let node: Node | null;
  while ((node = walker.nextNode())) {
    // Keep whitespace-only nodes too (spaces between highlight spans)
    if (node.textContent !== null && node.textContent.length > 0) {
      nodes.push(node as Text);
    }
  }

  nodes.forEach((textNode) => {
    const content = textNode.textContent ?? "";
    if (!content) return;

    // Pure whitespace between elements
    if (/^\s+$/.test(content)) {
      const span = document.createElement("span");
      span.className = SPACE;
      span.textContent = content;
      textNode.parentNode?.replaceChild(span, textNode);
      return;
    }

    const parts = content.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    parts.forEach((part) => {
      if (!part) return;
      const span = document.createElement("span");
      if (/^\s+$/.test(part)) {
        span.className = SPACE;
        span.textContent = part;
      } else {
        span.className = WORD;
        span.textContent = part;
      }
      frag.appendChild(span);
    });

    textNode.parentNode?.replaceChild(frag, textNode);
  });
}

function highlightClass(el: HTMLElement, root: HTMLElement): string | undefined {
  let parent = el.parentElement;
  while (parent && parent !== root) {
    if (
      parent.tagName === "SPAN" &&
      parent.className &&
      !parent.classList.contains(WORD) &&
      !parent.classList.contains(SPACE)
    ) {
      return parent.className;
    }
    parent = parent.parentElement;
  }
  return undefined;
}

function groupLines(container: HTMLElement) {
  const items = Array.from(
    container.querySelectorAll<HTMLElement>(`.${WORD}, .${SPACE}`),
  );
  const groups: HTMLElement[][] = [];
  let line: HTMLElement[] = [];
  let lastTop = Number.NaN;

  items.forEach((item) => {
    const top = item.offsetTop;
    if (Number.isNaN(lastTop)) lastTop = top;
    if (top > lastTop + 1) {
      groups.push(line);
      line = [];
      lastTop = top;
    }
    line.push(item);
  });

  if (line.length) groups.push(line);
  return groups;
}

function toSegments(group: HTMLElement[], root: HTMLElement): LineSegment[] {
  const segments: LineSegment[] = [];

  group.forEach((el) => {
    const text = el.textContent ?? "";
    if (!text) return;

    const className = highlightClass(el, root);
    const prev = segments[segments.length - 1];

    if (prev && prev.className === className) {
      prev.text += text;
      return;
    }

    segments.push({ text, className });
  });

  // Trim leading/trailing whitespace-only edges without eating mid-line spaces
  while (segments.length && !/\S/.test(segments[0].text)) segments.shift();
  while (segments.length && !/\S/.test(segments[segments.length - 1].text)) {
    segments.pop();
  }

  return segments;
}

/** Split an element into real wrapped lines as clean text segments. */
export function measureLines(source: HTMLElement): LineSegment[][] {
  if (source.clientWidth <= 0) return [];

  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.cssText = [
    "position:absolute",
    "visibility:hidden",
    "pointer-events:none",
    "left:0",
    "top:0",
    `width:${source.clientWidth}px`,
  ].join(";");

  source.parentElement?.appendChild(clone);
  wrapWords(clone);
  const groups = groupLines(clone);
  const lines = groups
    .map((group) => toSegments(group, clone))
    .filter((segments) => segments.some((s) => /\S/.test(s.text)));
  clone.remove();
  return lines;
}
