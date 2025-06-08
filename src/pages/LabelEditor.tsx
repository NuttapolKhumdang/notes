import {
  createSignal,
  For,
  Match,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { Notes, NoteSyncLocal, setNotes } from "../lib/notes";
import Icon from "../components/Icon";
import NoteMenuButton from "../components/Notes/NoteMenuButton";

type labelTag_t = {
  label: string;
  onDelete?: (label: string) => void;
  onEdited?: (o: string, n: string) => void;
};

const LabelTag: Component<labelTag_t> = ({
  label,
  onDelete = (label: string) => null,
  onEdited = (o: string, n: string) => null,
}) => {
  const [labelValue, setLabelValue] = createSignal<string>(label);
  const [isEditing, setEditing] = createSignal<boolean>(false);

  const handleSaved = () => {
    onEdited(label, labelValue());
    setEditing(false);
  };

  return (
    <div class="flex flex-row items-center justify-between rounded-xl border border-neutral-200 p-2">
      <header class="flex flex-1 flex-row items-center gap-2">
        <Icon name="label" />

        <Show when={!isEditing()}>
          <span class="text-xl">{label}</span>
        </Show>
        <Show when={isEditing()}>
          <input
            type="text"
            placeholder="ป้ายกำกับ"
            value={labelValue()}
            class="flex-1 border-b border-neutral-200 text-xl outline-none"
            onInput={(ev) => setLabelValue(ev.target.value)}
          />
        </Show>
      </header>

      <menu class="flex flex-row">
        <Switch>
          <Match when={!isEditing()}>
            <NoteMenuButton
              icon="edit"
              label="แก้ไข"
              action={() => setEditing(true)}
            />
          </Match>
          <Match when={isEditing()}>
            <NoteMenuButton
              icon="save"
              label="บันทึก"
              action={() => handleSaved()}
            />
          </Match>
        </Switch>

        <NoteMenuButton
          icon="delete"
          label="ลบ"
          action={() => onDelete(label)}
        />
      </menu>
    </div>
  );
};

const LabelEditor: Component = () => {
  const handleDelete = (label: string) => {
    setNotes("Label", (pv) => pv.filter((k) => k !== label));
    setNotes("Notes", (notes) =>
      notes.map((n) => {
        if (n.label?.length && n.label.length > 0)
          n.label = n.label.filter((k) => k !== label);
        return n;
      }),
    );
    NoteSyncLocal();
  };

  const handleRename = (o: string, n: string) => {
    setNotes("Label", (pv) => pv.map((k) => (k === o ? n : k)));
    setNotes("Notes", (notes) =>
      notes.map((note) => {
        if (note.label?.length && note.label.length > 0)
          note.label = note.label.map((k) => (k === o ? n : k));
        return note;
      }),
    );
  };

  return (
    <main class="container mx-auto flex h-full max-w-3xl flex-col gap-4">
      <header class="text-sm text-neutral-600">แก้ไขป้ายกำกับ</header>
      <section class="container flex flex-col gap-2">
        <For each={Notes.Label}>
          {(label) => (
            <LabelTag
              label={label}
              onDelete={(label) => handleDelete(label)}
              onEdited={(o, n) => handleRename(o, n)}
            />
          )}
        </For>
      </section>
    </main>
  );
};

export default LabelEditor;
