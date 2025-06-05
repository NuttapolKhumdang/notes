import { For, Match, Switch, type Component } from "solid-js";
import NoteMenuButton from "./NoteMenuButton";
import { INote, NoteSyncLocal, Notes, setNotes } from "../../lib/notes";
import { TagLabel } from "./NoteTags";

const NoteItem: Component<{ n: INote }> = ({
  n: { id, title, body, label, status, created, updated },
}) => {
  const NoteActionHandler = (action: INote["status"], s: boolean) => {
    // const Note = Notes.Notes;
    let note: INote = {
      id,
      title,
      body,
      label,
      status,
      created,
      updated,
    };

    if (action == "archive" && s) note.status = "archive";
    if (action == "pinned" && s) note.status = "pinned";
    if (!s) note.status = undefined;

    setNotes(
      "Notes",
      Notes.Notes.findIndex((k) => k.id === id),
      note,
    );

    NoteSyncLocal();
  };

  return (
    <div class="group rounded-xl border border-neutral-200 p-2 pb-1">
      <h2 class="text-lg">{title}</h2>
      <span class="text-sm whitespace-pre-wrap">{body}</span>

      <menu class="flex flex-row justify-between gap-1 text-neutral-600">
        <div class="flex flex-row gap-1 opacity-0 duration-300 group-hover:opacity-100">
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

        <div class="flex flex-row items-center justify-center">
          <For each={label}>{(l) => <TagLabel label={l} />}</For>
        </div>
      </menu>
    </div>
  );
};

export default NoteItem;
