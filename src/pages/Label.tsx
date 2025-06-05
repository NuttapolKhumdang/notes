import { For, type Component } from "solid-js";
import { Notes } from "../lib/notes";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";

const Label: Component = () => {
  return (
    <main class="container mx-auto flex h-full max-w-2xl flex-col gap-4">
      <header class="text-sm text-neutral-600">ป้ายกำกับ</header>
      <section class="container grid grid-cols-3 gap-2">
        <For each={[0, 1, 2]}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={Notes.Notes.filter(
                  (k) =>
                    (k.label?.length &&
                      k.label?.length !== 0 &&
                      k.status !== "delete") &&
                    k.status !== "archive",
                ).filter((k, i) => i % 3 === container)}
              >
                {(n) => <NoteItem n={n} bin />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>
    </main>
  );
};

export default Label;
