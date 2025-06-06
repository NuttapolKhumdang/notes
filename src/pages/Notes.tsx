import {
  For,
  Show,
  onMount,
  createSignal,
  type Component,
} from "solid-js";
import NoteMenuButton from "../components/Notes/NoteMenuButton";
import NoteColumnContainer from "../components/Notes/NoteColumnContainer";
import NoteItem from "../components/Notes/NoteItem";
import { NoteTagSelectorItem, TagLabel } from "../components/Notes/NoteTags";
import { INote, NoteSyncLocal } from "../lib/notes";
import { Notes, setNotes } from "../lib/notes";
import { autoTextareaSize } from "../lib/textarea";

const Note: Component = () => {
  const [noteFieldTitle, setNoteFieldTitle] = createSignal<string>("");
  const [noteFieldBody, setNoteFieldBody] = createSignal<string>("");
  const [noteFieldLabel, setNoteFieldLabel] = createSignal<string>("");
  const [noteSelectedLabel, setNoteSelectedLabel] = createSignal<string[]>([]);
  const [showLabelSelector, setShowLabelSelector] =
    createSignal<boolean>(false);

  const NoteGetNextId = (): number => {
    if (Notes.Notes.length > 0)
      return Notes.Notes[Notes.Notes.length - 1].id + 1;
    else return 0;
  };

  const handleNoteAdd = (pinned: boolean = false, archive: boolean = false) => {
    // get value of title and body
    const title = noteFieldTitle();
    const body = noteFieldBody();

    // create note instance
    const note: INote = {
      id: NoteGetNextId(),
      title,
      body,
      label: noteSelectedLabel(),
      created: new Date(),
      updated: new Date(),

      status: ((): INote["status"] => {
        if (pinned) return "pinned";
        if (archive) return "archive";
      })(),
    };

    // verify not empty body or title
    if (!(note.body || note.title)) return;
    // save note
    setNotes("Notes", (pv) => [...pv, note]);

    // reset field
    setNoteFieldTitle("");
    setNoteFieldBody("");
    setShowLabelSelector(false);
    // sync local with current Notes
    NoteSyncLocal();
  };

  const handleLabelAddNew = () => {
    // add new label to selected
    setNoteSelectedLabel([...noteSelectedLabel(), noteFieldLabel()]);
    // add new label to storage
    setNotes("Label", (pv) => [...pv, noteFieldLabel()]);
    // reset field
    setNoteFieldLabel("");
    // sync local with current Notes
    NoteSyncLocal();
  };

  const handleLabelRemove = (label: string) => {
    // add new label to storage
    setNotes("Label", (pv) => pv.filter((k) => k !== label));
    setNotes("Notes", (notes) =>
      notes.map((n) => {
        if (n.label?.length && n.label.length > 0)
          n.label = n.label.filter((k) => k !== label);
        return n;
      }),
    );
    // sync local with current Notes
    NoteSyncLocal();
  };

  const handleLabelSelected = (t: string, checked: boolean) => {
    if (checked) {
      setNoteSelectedLabel([...noteSelectedLabel(), t]);
    } else {
      setNoteSelectedLabel(noteSelectedLabel().filter((k) => k != t));
    }
  };

  let NoteInputRef: HTMLTextAreaElement;

  onMount(() => {
    autoTextareaSize(NoteInputRef);
  });

  return (
    <main class="container mx-auto flex h-full max-w-2xl flex-col gap-4">
      <section class="flex flex-col gap-2 rounded-xl border border-neutral-200 p-2">
        <header class="flex flex-col">
          <input
            type="text"
            placeholder="ชื่อเรื่อง"
            class="py-2 text-xl font-medium outline-none"
            value={noteFieldTitle()}
            onInput={(ev) => setNoteFieldTitle(ev.target.value)}
          />

          <textarea
            ref={NoteInputRef!}
            placeholder="จดโน้ต"
            class="resize-none outline-none"
            value={noteFieldBody()}
            onInput={(ev) => setNoteFieldBody(ev.target.value)}
          ></textarea>
        </header>

        <menu class="flex flex-row justify-between">
          <div class="flex flex-row items-center gap-1 text-neutral-600">
            <div class="relative">
              <NoteMenuButton
                action={() => setShowLabelSelector(!showLabelSelector())}
                icon="label"
                label="เพิ่มป้ายกำกับ"
              />

              <Show when={showLabelSelector()}>
                <section class="absolute top-8 left-0 z-20 flex w-max flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-100 p-2">
                  <span class="text-sm">เพิ่มป้ายกำกับ</span>
                  <input
                    type="text"
                    class="border-b border-neutral-200 text-sm outline-none"
                    placeholder="ป้ายกำกับใหม่"
                    value={noteFieldLabel()}
                    onInput={(ev) => setNoteFieldLabel(ev.target.value)}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") handleLabelAddNew();
                    }}
                  />
                  <menu class="flex flex-col gap-1">
                    <For each={Notes.Label}>
                      {(t) => (
                        <NoteTagSelectorItem
                          label={t}
                          checked={noteSelectedLabel().includes(t)}
                          onChange={(checked) =>
                            handleLabelSelected(t, checked)
                          }
                          onDelete={(label) => handleLabelRemove(label)}
                        />
                      )}
                    </For>
                  </menu>
                </section>
              </Show>
            </div>
          </div>

          <div class="flex flex-row items-center gap-1 text-neutral-600">
            <NoteMenuButton
              action={() => handleNoteAdd(true)}
              icon="keep"
              label="ปักหมุด"
            />
            <NoteMenuButton
              action={() => handleNoteAdd(false, true)}
              icon="archive"
              label="เก็บ"
            />

            <hr class="h-6 border border-neutral-200" />

            <button
              onClick={() => handleNoteAdd()}
              class="size-max cursor-pointer rounded border border-transparent p-1 text-sm duration-150 hover:border-neutral-200"
            >
              บันทึก
            </button>
          </div>
        </menu>
      </section>

      <Show
        when={Notes.Notes.filter((k) => k.status === "pinned").length !== 0}
      >
        <header class="text-sm text-neutral-600">ปักหมุด</header>
        <section class="container grid grid-cols-2 md:grid-cols-3 gap-2">
          <For each={Notes.Runtime.renderColumn}>
            {(container) => (
              <NoteColumnContainer>
                <For
                  each={Notes.Notes.filter((k) => k.status === "pinned").filter(
                    (k, i) => i % Notes.Runtime.renderColumn.length === container,
                  )}
                >
                  {(n) => <NoteItem n={n} />}
                </For>
              </NoteColumnContainer>
            )}
          </For>
        </section>
      </Show>

      <header class="text-sm text-neutral-600">โน้ตอื่นๆ</header>
      <section class="container grid grid-cols-2 md:grid-cols-3 gap-2">
        <For each={Notes.Runtime.renderColumn}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={
                  Notes.Notes.filter((k) => !k.status) // clear archive or pinned note
                    .filter((k, i) => i % Notes.Runtime.renderColumn.length === container) // for sorting to column
                }
              >
                {(n) => <NoteItem n={n} />}
              </For>
            </NoteColumnContainer>
          )}
        </For>
      </section>
    </main>
  );
};

export default Note;
