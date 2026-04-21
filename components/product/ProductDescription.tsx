"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ProductDescriptionProps {
  html: string;
  title: string;
  readMoreLabel: string;
  readLessLabel: string;
}

const COLLAPSE_THRESHOLD = 200; // px height before collapsing

/** Strip dangerous tags/attributes from Bittel HTML, keep safe formatting. */
function sanitizeHtml(dirty: string): string {
  const ALLOWED_TAGS = new Set([
    "p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "span", "div", "table",
    "thead", "tbody", "tr", "th", "td", "a", "img", "sup", "sub",
  ]);
  // Remove <script>, <iframe>, <object>, <embed>, <form>, event handlers
  return dirty
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "") // onclick, onerror, etc.
    .replace(/javascript\s*:/gi, "")
    .replace(/<\/?(\w+)([^>]*)>/g, (match, tag, attrs) => {
      if (!ALLOWED_TAGS.has(tag.toLowerCase())) return "";
      // Strip all attributes except href, src, alt, class
      const safeAttrs = (attrs as string).replace(
        /\s(\w+)\s*=\s*["'][^"']*["']/g,
        (attrMatch: string, attrName: string) => {
          if (["href", "src", "alt", "class", "colspan", "rowspan"].includes(attrName.toLowerCase())) return attrMatch;
          return "";
        }
      );
      return `<${match.startsWith("</") ? "/" : ""}${tag.toLowerCase()}${safeAttrs}>`;
    });
}

export default function ProductDescription({
  html,
  title,
  readMoreLabel,
  readLessLabel,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setNeedsCollapse(height > COLLAPSE_THRESHOLD);
    }
  }, [html]);

  // Check if description is just the title repeated (common Bittel API issue)
  const strippedHtml = html.replace(/<[^>]*>/g, "").trim();
  const normalizedTitle = title.replace(/\s+/g, " ").trim().toLowerCase();
  const normalizedDesc = strippedHtml.replace(/\s+/g, " ").trim().toLowerCase();

  if (
    !strippedHtml ||
    normalizedDesc === normalizedTitle ||
    normalizedDesc.length < 10
  ) {
    return null;
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div
        ref={contentRef}
        className={`relative px-5 pt-5 transition-all duration-300 ease-in-out ${
          needsCollapse && !isExpanded ? "max-h-[200px] overflow-hidden" : ""
        }`}
        style={
          needsCollapse && !isExpanded
            ? { maxHeight: `${COLLAPSE_THRESHOLD}px` }
            : undefined
        }
      >
        <div
          className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
        {needsCollapse && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {needsCollapse && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-3 text-sm font-medium text-primary hover:text-primary-dark transition-colors border-t border-border/50"
          aria-expanded={isExpanded}
        >
          {isExpanded ? readLessLabel : readMoreLabel}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      )}
      {(!needsCollapse || isExpanded) && <div className="pb-5" />}
    </div>
  );
}
