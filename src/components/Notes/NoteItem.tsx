import { For, Match, Switch, type Component } from "solid-js";
import NoteMenuButton from "./NoteMenuButton";
import { INote, NoteSyncLocal, Notes, setNotes } from "../../lib/notes";
import { TagLabel } from "./NoteTags";
import { setViewing, Tab } from "../../App";

const NoteItem: Component<{ n: INote; bin?: boolean }> = ({
  n: { id, title, body, label, status, created, updated },
  bin = false,
}) => {
  let note: INote = {
    id,
    title,
    body,
    label,
    status,
    created,
    updated,
  };

  const NoteActionHandler = (action: INote["status"], s: boolean) => {
    if (action == "archive" && s) note.status = "archive";
    if (action == "pinned" && s) note.status = "pinned";
    if (!s) note.status = undefined;
    note.updated = new Date();

    setNotes(
      "Notes",
      Notes.Notes.findIndex((k) => k.id === id),
      note,
    );

    NoteSyncLocal();
  };

  const handleNoteRemove = () => {
    note.status = "delete";
    note.updated = new Date();

    const index = Notes.Notes.findIndex((k) => k.id === id);

    if (bin) setNotes("Notes", (pv) => pv.filter((k) => k.id !== id));
    else setNotes("Notes", index, note);

    NoteSyncLocal();
  };

  const handleClickToEditor = () => {
    setNotes((notes) => ({ Runtime: { editorId: id } }));
    setViewing(Tab.Editor);
  };

  return (
    <div class="group cursor-pointer rounded-xl border border-neutral-200 p-2 pb-1 duration-150 hover:border-neutral-400">
      <h2 class="text-lg">{title}</h2>
      <span
        onClick={() => handleClickToEditor()}
        class="text-sm whitespace-pre-wrap"
      >
        {body}
      </span>

      <div class="flex flex-row flex-wrap items-center justify-end gap-1">
        <For each={label}>{(l) => <TagLabel label={l} />}</For>
      </div>

      <menu class="flex flex-row justify-between gap-1 text-neutral-600">
        <div class="flex flex-row opacity-0 duration-300 group-hover:opacity-100">
          <Switch>
            <Match when={status === "pinned"}>
              <NoteMenuButton
                action={() => NoteActionHandler("pinned", false)}
                icon="keep_off"
                label="เลิกปักหมุด"
              />
            </Match>
            <Match when={status !== "pinned"}>
              <NoteMenuButton
                action={() => NoteActionHandler("pinned", true)}
                icon="keep"
                label="ปักหมุด"
              />
            </Match>
          </Switch>

          <Switch>
            <Match when={status !== "archive"}>
              <NoteMenuButton
                action={() => NoteActionHandler("archive", true)}
                icon="archive"
                label="เก็บ"
              />
            </Match>
            <Match when={status === "archive"}>
              <NoteMenuButton
                action={() => NoteActionHandler("archive", false)}
                icon="unarchive"
                label="เลิกเก็บ"
              />
            </Match>
          </Switch>
        </div>
        <div class="flex flex-row opacity-0 duration-300 group-hover:opacity-100">
          <NoteMenuButton
            action={() => handleNoteRemove()}
            icon="delete"
            label="ลบโน้ต"
          />
        </div>
      </menu>
    </div>
  );
};

export default NoteItem;
