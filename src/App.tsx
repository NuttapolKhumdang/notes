import { Component, createEffect, createSignal, Match, Switch } from "solid-js";
import Notes from "./pages/Notes";
import Icon from "./components/Icon";
import Archive from "./pages/Archive";
import Bin from "./pages/Bin";

enum Tab {
  Notes,
  Label,
  Archive,
  Bin,
}

const [viewing, setViewing] = createSignal<Tab>(Tab.Notes);

type MenuButton_t = {
  label: string;
  icon: string;
  tab?: Tab;
  action?: VoidFunction;
};

function SyncViewLocal(t: Tab) {
  localStorage.setItem("tab", t.toString());
}

const MenuButton: Component<MenuButton_t> = ({
  label,
  icon,
  tab,
  action = () => null,
}) => {
  return (
    <button
      onClick={() => action()}
      class="flex flex-row items-center justify-start gap-3 rounded-xl px-2 pt-1 duration-200 hover:bg-neutral-200"
      classList={{
        "bg-amber-100": viewing() === tab,
      }}
    >
      <span class="mt-1">
        <Icon name={icon} size={1.8} />
      </span>
      <span class="text-xl font-medium">{label}</span>
    </button>
  );
};

const App: Component = () => {
  createEffect(() => {
    SyncViewLocal(viewing());
  });

  return (
    <>
      <nav class="p-4"></nav>

      <main class="grid grid-cols-[18rem_1fr] gap-4 px-4">
        <aside class="flex h-max flex-col rounded-2xl border border-neutral-200 p-2">
          <MenuButton
            label="โน้ต"
            icon="note_alt"
            tab={Tab.Notes}
            action={() => setViewing(Tab.Notes)}
          />
          <MenuButton
            label="ป้ายกำกับ"
            icon="label"
            tab={Tab.Label}
            action={() => setViewing(Tab.Label)}
          />
          <MenuButton
            label="เก็บ"
            icon="archive"
            tab={Tab.Archive}
            action={() => setViewing(Tab.Archive)}
          />
          <MenuButton
            label="ถังขยะ"
            icon="delete"
            tab={Tab.Bin}
            action={() => setViewing(Tab.Bin)}
          />
        </aside>

        <Switch>
          <Match when={viewing() === Tab.Notes}>
            <Notes />
          </Match>
          <Match when={viewing() === Tab.Archive}>
            <Archive />
          </Match>
          <Match when={viewing() === Tab.Bin}>
            <Bin />
          </Match>
        </Switch>
      </main>
    </>
  );
};

export default App;
