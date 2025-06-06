import {
  Component,
  createEffect,
  createSignal,
  Match,
  onMount,
  Switch,
} from "solid-js";
import Notes from "./pages/Notes";
import Icon from "./components/Icon";
import Archive from "./pages/Archive";
import Bin from "./pages/Bin";
import Label from "./pages/Label";
import Editor from "./pages/Editor";
import { setNotes } from "./lib/notes";

export enum Tab {
  Notes,
  Label,
  Archive,
  Bin,
  Editor,
}

export const [viewing, setViewing] = createSignal<Tab>(Tab.Notes);

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
      class="flex flex-row items-center justify-center gap-3 rounded-xl px-2 pt-1 duration-200 hover:bg-neutral-200 md:justify-start"
      classList={{
        "bg-amber-100": viewing() === tab,
      }}
    >
      <span class="mt-1">
        <Icon name={icon} size={1.8} />
      </span>
      <span class="hidden text-xl font-medium md:block">{label}</span>
    </button>
  );
};

const App: Component = () => {
  const [currnetRenderColumnSize, setRenderCoulmnSize] = createSignal<number[]>(
    [0, 1, 2],
  );

  onMount(() => {
    window.addEventListener("resize", () => {
      const renderColumn = window.innerWidth > 768 ? [0, 1, 2] : [0, 1];
      if (renderColumn.length !== currnetRenderColumnSize().length) {
        setRenderCoulmnSize(renderColumn);
        setNotes((notes) => ({ Runtime: { renderColumn } }));
      }
    });
  });

  createEffect(() => {
    SyncViewLocal(viewing());
  });

  return (
    <>
      <nav class="p-4"></nav>

      <main class="flex flex-col gap-4 px-4 md:grid md:grid-cols-[18rem_1fr]">
        <aside class="sticky top-8 z-20 flex h-max flex-row gap-4 md:flex-col">
          <section class="hidden h-max flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-2 md:flex">
            <header class="px-2 pt-2 pb-1">
              <h1 class="text-2xl">โน้ต</h1>
            </header>
          </section>

          <section class="flex h-16 flex-1 flex-row rounded-2xl border border-neutral-200 bg-neutral-50 p-2 *:flex-1 md:h-max md:flex-col">
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
          </section>

          <footer class="flex h-16 cursor-default flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-2 md:h-max">
            <header class="flex h-full flex-col items-center justify-center gap-1 p-1 md:items-start md:justify-start">
              <a
                href="https://nuttapolkhumdang.work"
                class="font-mono-display flex w-max flex-col leading-none md:py-2"
              >
                <span>Nuttapol</span>
                <span>Khumdang</span>
              </a>
              <span class="hidden font-mono text-[10px] md:block">
                Inspired by{" "}
                <a
                  href="https://keep.google.com"
                  target="_blank"
                  class="hover:underline"
                >
                  google keep
                </a>{" "}
                but less feature.
              </span>
              <span class="hidden font-mono text-[10px] md:block">
                &copy; 2025 Nuttapol Khumdang
              </span>
            </header>
          </footer>
        </aside>

        <Switch>
          <Match when={viewing() === Tab.Notes}>
            <Notes />
          </Match>
          <Match when={viewing() === Tab.Label}>
            <Label />
          </Match>
          <Match when={viewing() === Tab.Archive}>
            <Archive />
          </Match>
          <Match when={viewing() === Tab.Bin}>
            <Bin />
          </Match>
          <Match when={viewing() === Tab.Editor}>
            <Editor />
          </Match>
        </Switch>
      </main>
    </>
  );
};

export default App;
