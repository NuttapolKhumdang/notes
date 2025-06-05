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
import { TagLabel } from "../components/Notes/NoteTags";
import { INote, NoteSyncLocal } from "../lib/notes";

function autoTextareaSize(obj: HTMLTextAreaElement) {
  obj.style.height = obj.scrollHeight / 2 + "px";
  obj.style.overflowY = "hidden";

  obj.addEventListener("input", function () {
    obj.style.height = "auto";
    obj.style.height = obj.scrollHeight + "px";
  });
}

const Notes: Component = () => {
  const [noteFieldTitle, setNoteFieldTitle] = createSignal<string>("");
  const [noteFieldBody, setNoteFieldBody] = createSignal<string>("");
  const [Notes, setNotes] = createSignal<INote[]>(
    JSON.parse(localStorage.getItem("notes") ?? "[]"),
  );

  const NoteGetNextId = (): number => {
    return Notes().length + 1;
  };

  const NoteAddHandler = (
    pinned: boolean = false,
    archive: boolean = false,
  ) => {
    const title = noteFieldTitle();
    const body = noteFieldBody();

    const note: INote = {
      id: NoteGetNextId(),
      title,
      body,
      created: new Date(),
      updated: new Date(),

      status: ((): INote["status"] => {
        if (pinned) return "pinned";
        if (archive) return "archive";
      })(),
    };

    setNotes([...Notes(), note]);

    setNoteFieldTitle("");
    setNoteFieldBody("");
    NoteSyncLocal(Notes());
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
            <NoteMenuButton
              action={() => NoteAddHandler(true)}
              icon="keep"
              label="ปักหมุด"
            />
            <NoteMenuButton
              action={() => NoteAddHandler(false, true)}
              icon="archive"
              label="เก็บ"
            />
          </div>

          <div class="flex flex-row items-center gap-1 text-neutral-600">
            <div class="relative">
              <NoteMenuButton icon="label" label="เพิ่มป้ายกำกับ" />
            </div>
            <section class="flex flex-row gap-2">
              <TagLabel label="Lyrics" />
            </section>

            <hr class="h-6 border border-neutral-200" />

            <button
              onClick={() => NoteAddHandler()}
              class="size-max cursor-pointer rounded border border-transparent px-1 text-sm duration-150 hover:border-neutral-200"
            >
              บันทึก
            </button>
          </div>
        </menu>
      </section>

      <Show when={Notes().filter((k) => k.status === "pinned").length !== 0}>
        <header class="text-sm text-neutral-600">ปักหมุด</header>
        <section class="container grid grid-cols-3 gap-2">
          <For each={[0, 1, 2]}>
            {(container) => (
              <NoteColumnContainer>
                <For
                  each={Notes().filter(
                    (k, i) => i % 3 === container && k.status === "pinned",
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
      <section class="container grid grid-cols-3 gap-2">
        <For each={[0, 1, 2]}>
          {(container) => (
            <NoteColumnContainer>
              <For
                each={
                  Notes()
                    .filter((k) => !k.status) // clear archive or pinned note
                    .filter((k, i) => i % 3 === container) // for sorting to column
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

export default Notes;
