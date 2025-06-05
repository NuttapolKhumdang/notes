import type { JSXElement, Component } from "solid-js";

const NoteColumnContainer: Component<{ children: JSXElement }> = ({
  children,
}) => {
  return <div class="flex flex-col gap-2">{children}</div>;
};

export default NoteColumnContainer;
