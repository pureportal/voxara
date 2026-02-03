import type { CSSProperties, MouseEvent } from "react";
import { memo, useMemo } from "react";
import { formatBytes } from "../../lib/utils";
import type { FlatNode, ScanNode } from "./types";

const getDepthTone = (depth: number): string => {
  return depth % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/60";
};

const getTreeRowClassName = (isActive: boolean, depthTone: string): string => {
  // Use flex and full width so the row background spans the entire list.
  if (isActive) {
    return "flex items-center min-w-full w-full gap-3 px-2 text-left text-sm transition bg-blue-500/15 text-blue-100 border border-blue-500/30 rounded-md";
  }
  // Remove hover from sticky part? No.
  return `flex items-center min-w-full w-full gap-3 px-2 text-left text-sm transition ${depthTone} text-slate-200 hover:bg-slate-800/80 hover:border-slate-800/70 border border-transparent rounded-md`;
};

const getExpandButtonClassName = (hasChildren: boolean): string => {
  const visibility = hasChildren ? "visible" : "invisible";
  return `flex h-5 w-5 flex-none items-center justify-center rounded text-xs text-slate-300 transition hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 ${visibility}`;
};

const getMaxSizeByDepth = (items: FlatNode[]): Map<number, number> => {
  const map = new Map<number, number>();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item) continue;
    const size = item.node.sizeBytes ?? 0;
    const current = map.get(item.depth) ?? 0;
    if (size > current) {
      map.set(item.depth, size);
    }
  }
  return map;
};

const getRowFillPercent = (
  sizeBytes: number,
  depth: number,
  maxSizeByDepth: Map<number, number>,
): number => {
  const maxSize = maxSizeByDepth.get(depth) ?? 0;
  if (maxSize <= 0) return 0;
  const ratio = sizeBytes / maxSize;
  if (!Number.isFinite(ratio)) return 0;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
};

const getRowFillStyle = (percent: number): CSSProperties => {
  if (percent <= 0) {
    return { backgroundClip: "content-box" };
  }
  return {
    backgroundImage: `linear-gradient(90deg, rgba(59,130,246,0.18) ${percent}%, rgba(59,130,246,0) ${percent}%)`,
    backgroundClip: "content-box",
  };
};

interface ScanTreeProps {
  treeItems: FlatNode[];
  expandedPaths: Set<string>;
  selectedPath: string | null;
  onToggleExpand: (path: string, currentlyExpanded: boolean) => void;
  onSelect: (path: string) => void;
  onDouble: (node: ScanNode) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>, node: ScanNode) => void;
}

const ScanTree = memo(
  ({
    treeItems,
    expandedPaths,
    selectedPath,
    onToggleExpand,
    onSelect,
    onDouble,
    onContextMenu,
  }: ScanTreeProps) => {
    const maxSizeByDepth = useMemo(() => {
      return getMaxSizeByDepth(treeItems);
    }, [treeItems]);

    return (
      <>
        {treeItems.map((item) => {
          const isExpanded = expandedPaths.has(item.node.path);
          const hasChildren = item.node.children.length > 0;
          const fillPercent = getRowFillPercent(
            item.node.sizeBytes,
            item.depth,
            maxSizeByDepth,
          );
          const depthStyle = {
            paddingLeft: 8 + item.depth * 14,
            ...getRowFillStyle(fillPercent),
          };
          const rowClass = getTreeRowClassName(
            item.node.path === selectedPath,
            getDepthTone(item.depth),
          );

          return (
            <div
              key={item.node.path}
              className={rowClass}
              style={depthStyle}
              onClick={() => onSelect(item.node.path)}
              onContextMenu={(event) => onContextMenu?.(event, item.node)}
              onDoubleClick={(event) => {
                event.stopPropagation();
                onDouble(item.node);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(item.node.path);
                }
              }}
            >
              <div className="flex flex-none items-center gap-2 py-1.5 pr-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!hasChildren) return;
                    onToggleExpand(item.node.path, isExpanded);
                  }}
                  className={getExpandButtonClassName(hasChildren)}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>
                {/* Name - allow it to be wide. whitespace-nowrap ensures it pushes width. */}
                <span className="whitespace-nowrap">
                  {item.node.name || item.node.path}
                </span>
              </div>

              {/* Sticky Usage Column */}
              {/* Using ml-auto to push it to the right if there is space, but sticky right-0 keeps it visible on scroll */}
              {/* Need a background to cover scrolled text. Inherit might work if parent is opaque.
                Parent has a bg color (slate-900/40 etc).
                If we scroll, text goes behind this div.
                We need a solid bg for this cell that matches the row's appearance.
                Since row appearance is dynamic (hover, select), this is tricky.
                Simple fix: use a solid gradient/color for this cell, or just bg-slate-900 and hope it blends reasonably.
            */}
              <span className="sticky right-0 ml-auto flex-none py-1.5 pl-4 pr-2 text-right text-xs text-slate-300 tabular-nums bg-slate-950/70 backdrop-blur-sm border-l border-white/5">
                {formatBytes(item.node.sizeBytes)}
              </span>
            </div>
          );
        })}
      </>
    );
  },
);

export default ScanTree;
