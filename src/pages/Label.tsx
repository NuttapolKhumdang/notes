import { For, Show, type Component } from "solid-js";
import { Notes } from "../lib/notes";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";
import NoteNotFoundFallback from "../components/Notes/NotFound";

const Label: Component = () => {
  return (
    <main class="container mx-auto flex h-full max-w-2xl flex-col gap-4">
      <header class="text-sm text-neutral-600">ป้ายกำกับ</header>
      <section class="container grid grid-cols-2 md:grid-cols-3 gap-2">
        <For each={Notes.Runtime.renderColumn}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={Notes.Notes.filter(
                  (k) =>
                    k.label?.length &&
                    k.label?.length !== 0 &&
                    k.status !== "delete" &&
                    k.status !== "archive",
                ).filter((k, i) => i % Notes.Runtime.renderColumn.length === container)}
              >
                {(n) => <NoteItem n={n} bin />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>
      <Show
        when={
          Notes.Notes.filter((k) => k.label && k.label?.length !== 0).length ===
          0
        }
      >
        <NoteNotFoundFallback />
      </Show>
    </main>
  );
};

export default Label;
