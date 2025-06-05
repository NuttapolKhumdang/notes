import type { Component } from "solid-js";

export const TagLabel: Component<{ label: string }> = ({ label }) => {
  return (
    <span class="size-max rounded border border-neutral-200 bg-neutral-100 px-1 text-sm">
      {label}
    </span>
  );
};
