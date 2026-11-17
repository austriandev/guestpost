"use client";

import { useEffect, useState } from "react";

/**
 * Types each phrase, holds, deletes, moves to the next. The first phrase is
 * server-rendered in full so the headline reads correctly before JS and for
 * crawlers; screen readers get the static phrase only.
 */
export function TypedWords({
  words,
  hold = 2200,
  srText,
}: {
  words: string[];
  hold?: number;
  srText?: string;
}) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(words[0]);
  const [mode, setMode] = useState<"hold" | "delete" | "type">("hold");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const word = words[index];
    let t: ReturnType<typeof setTimeout>;
    if (mode === "hold") {
      t = setTimeout(() => setMode("delete"), hold);
    } else if (mode === "delete") {
      t = shown.length
        ? setTimeout(() => setShown(shown.slice(0, -1)), 28)
        : setTimeout(() => {
            setIndex((index + 1) % words.length);
            setMode("type");
          }, 260);
    } else {
      t =
        shown.length < word.length
          ? setTimeout(() => setShown(word.slice(0, shown.length + 1)), 55 + Math.random() * 45)
          : setTimeout(() => setMode("hold"), 0);
    }
    return () => clearTimeout(t);
  }, [mode, shown, index, words, hold]);

  return (
    <>
      <span className="visually-hidden">{srText ?? words[0]}</span>
      <span className="typed" aria-hidden="true">
        <span className="typed__text">{shown || "​"}</span>
        <span className="typed__caret" />
      </span>
    </>
  );
}
