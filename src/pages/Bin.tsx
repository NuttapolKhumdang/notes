import { For, Show, type Component } from "solid-js";
import { Notes, NoteSyncLocal, setNotes } from "../lib/notes";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";
import NoteNotFoundFallback from "../components/Notes/NotFound";
import Footer from "../components/Footer";

const Bin: Component = () => {
  const handleRemoveAll = () => {
    setNotes("Notes", (pv) => pv.filter((k) => k.status !== "delete"));
    NoteSyncLocal();
  };

  return (
    <main class="container mx-auto flex h-full max-w-3xl flex-col gap-4">
      <header class="flex flex-row items-center justify-between">
        <h1 class="text-sm text-neutral-600">ถังขยะ</h1>
        <button
          onClick={() => handleRemoveAll()}
          class="cursor-pointer text-sm text-neutral-600 hover:underline"
        >
          ลบทั้งหมด
        </button>
      </header>

      <section class="container grid grid-cols-3 gap-2">
        <For each={Notes.Runtime.renderColumn}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={Notes.Notes.filter((k) => k.status === "delete").filter(
                  (k, i) => i % Notes.Runtime.renderColumn.length === container,
                )}
              >
                {(n) => <NoteItem n={n} bin />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>

      <Show
        when={Notes.Notes.filter((k) => k.status === "delete").length === 0}
      >
        <NoteNotFoundFallback />
      </Show>

      <Footer />
    </main>
  );
};

export default Bin;
