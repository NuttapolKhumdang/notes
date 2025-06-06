import {
  Accessor,
  createEffect,
  createSignal,
  For,
  Show,
  type Component,
} from "solid-js";
import { INote, Notes } from "../lib/notes";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";
import NoteNotFoundFallback from "../components/Notes/NotFound";
import Footer from "../components/Footer";

const Label: Component = () => {
  const [selected, setSelect] = createSignal<string>();
  const [notes, setNote] = createSignal<INote[]>(
    Notes.Notes.filter(
      (k) =>
        k.label?.length &&
        k.label?.length !== 0 &&
        k.status !== "delete" &&
        k.status !== "archive",
    ),
  );

  const updateFilter = () => {
    setNote(
      Notes.Notes.filter(
        (k) =>
          k.label?.length &&
          k.label?.length !== 0 &&
          k.status !== "delete" &&
          k.status !== "archive",
      ).filter((k) => (selected() ? k.label.includes(selected()) : true)),
    );
  };

  return (
    <main class="container mx-auto flex h-full max-w-2xl flex-col gap-4">
      <header class="flex flex-row items-center justify-between">
        <h1 class="text-sm text-neutral-600">ป้ายกำกับ</h1>
        <select
          onChange={(ev) => {
            setSelect(ev.target.value);
            updateFilter();
          }}
        >
          <option value={""}>ทั้งหมด</option>
          <For each={Notes.Label}>
            {(label) => <option value={label}>{label}</option>}
          </For>
        </select>
      </header>

      <section class="container grid grid-cols-2 gap-2 md:grid-cols-3">
        <For each={Notes.Runtime.renderColumn}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={notes().filter(
                  (k, i) => i % Notes.Runtime.renderColumn.length === container,
                )}
              >
                {(n) => <NoteItem n={n} bin />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>
      <Show when={notes().length === 0}>
        <NoteNotFoundFallback />
      </Show>

      <Footer />
    </main>
  );
};

export default Label;
