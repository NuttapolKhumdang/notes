import { type Component, createSignal, onMount, For, Show } from "solid-js";
import { INote, Notes, NoteSyncLocal, setNotes } from "../lib/notes";
import { autoTextareaSize } from "../lib/textarea";
import NoteMenuButton from "../components/Notes/NoteMenuButton";
import { NoteTagSelectorItem } from "../components/Notes/NoteTags";
import { setViewing, Tab } from "../App";
import Footer from "../components/Footer";

const Editor: Component = () => {
  const id = Notes.Runtime.editorId;
  const _note = Notes.Notes.filter((k) => k.id === id)[0];

  const [noteFieldTitle, setNoteFieldTitle] = createSignal<string>(_note.title);
  const [noteFieldBody, setNoteFieldBody] = createSignal<string>(_note.body);
  const [noteFieldLabel, setNoteFieldLabel] = createSignal<string>("");
  const [noteSelectedLabel, setNoteSelectedLabel] = createSignal<string[]>(
    _note.label,
  );

  const [showLabelSelector, setShowLabelSelector] =
    createSignal<boolean>(false);

  const handleNoteAdd = (pinned: boolean = false, archive: boolean = false) => {
    // get value of title and body
    const title = noteFieldTitle();
    const body = noteFieldBody();

    // create note instance
    const note: INote = {
      id,
      title,
      body,
      label: noteSelectedLabel(),
      updated: new Date(),

      status: ((): INote["status"] => {
        if (!pinned && !archive) return _note.status;
        if (pinned) return "pinned";
        if (archive) return "archive";
      })(),
    };

    // verify not empty body or title
    if (!(note.body || note.title)) return;
    // save note
    setNotes("Notes", (notes) =>
      notes.map((n) => {
        if (n.id === id) n = note;
        return n;
      }),
    );

    // reset field
    setNoteFieldTitle("");
    setNoteFieldBody("");
    setShowLabelSelector(false);
    // sync local with current Notes
    NoteSyncLocal();

    // warp to home page
    setViewing(Tab.Notes);
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

  let NoteInputTitleRef: HTMLTextAreaElement;
  let NoteInputBodyRef: HTMLTextAreaElement;

  onMount(() => {
    autoTextareaSize(NoteInputBodyRef, false);
    autoTextareaSize(NoteInputTitleRef, false);
  });

  return (
    <main class="container mx-auto flex h-full max-w-3xl flex-col gap-4">
      <section class="flex flex-col gap-2 rounded-xl border border-neutral-200 p-2">
        <header class="flex flex-col">
          <textarea
            ref={NoteInputTitleRef!}
            placeholder="ชื่อเรื่อง"
            class="py-2 text-xl font-medium resize-none outline-none"
            value={noteFieldTitle()}
            onInput={(ev) => setNoteFieldTitle(ev.target.value)}
          ></textarea>

          <textarea
            ref={NoteInputBodyRef!}
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
                <section class="absolute bottom-8 left-0 z-20 flex w-max flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-100 p-2">
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

      <Footer/>
    </main>
  );
};
export default Editor;
