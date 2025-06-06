import { For, Show, type Component } from "solid-js";
import { Notes } from "../lib/notes";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";
import NoteNotFoundFallback from "../components/Notes/NotFound";
import Footer from "../components/Footer";

const Archive: Component = () => {
  return (
    <main class="container mx-auto flex h-full max-w-3xl flex-col gap-4">
      <header class="text-sm text-neutral-600">เก็บ</header>
      <section class="container grid grid-cols-3 gap-2">
        <For each={Notes.Runtime.renderColumn}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={Notes.Notes.filter((k) => k.status === "archive").filter(
                  (k, i) => i % Notes.Runtime.renderColumn.length === container,
                )}
              >
                {(n) => <NoteItem n={n} />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>

      <Show
        when={Notes.Notes.filter((k) => k.status === "archive").length === 0}
      >
        <NoteNotFoundFallback />
      </Show>

      <Footer />
    </main>
  );
};

export default Archive;
