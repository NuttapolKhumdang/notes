import { For, Show, type Component } from "solid-js";
import NoteMenuButton from "./NoteMenuButton";
import { INote } from "../../lib/notes";
import { TagLabel } from "./NoteTags";

const NoteItem: Component<{ n: INote }> = ({
  n: { title, body, label, status },
}) => {
  return (
    <div class="group rounded-xl border border-neutral-200 p-2 pb-1">
      <h2 class="text-lg">{title}</h2>
      <span class="text-sm whitespace-pre-wrap">{body}</span>

      <menu class="flex flex-row justify-between gap-1 text-neutral-600">
        <div class="flex flex-row gap-1 opacity-0 duration-300 group-hover:opacity-100">
          <Show when={status === "pinned"}>
            <NoteMenuButton icon="keep_off" label="เลิกปักหมุด" />
          </Show>
          <Show when={status !== "pinned"}>
            <NoteMenuButton icon="keep" label="ปักหมุด" />
          </Show>
          <NoteMenuButton icon="archive" label="เก็บ" />
        </div>

        <div class="flex flex-row items-center justify-center">
          <For each={label}>{(l) => <TagLabel label={l} />}</For>
        </div>
      </menu>
    </div>
  );
};

export default NoteItem;
