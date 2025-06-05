import { createSignal, type Component } from "solid-js";
import Icon from "../Icon";

type noteMenuButton_t = {
  icon: string;
  label: string;

  action?: VoidFunction;
};

const NoteMenuButton: Component<noteMenuButton_t> = ({
  icon,
  label,
  action = () => null,
}) => {
  const [showLabel, setShowLabel] = createSignal<boolean>(false);
  let showLabelTimer: number;

  const setLebelShow = (show: boolean) => {
    if (show) {
      showLabelTimer = setTimeout(() => {
        setShowLabel(true);
      }, 800);
    } else {
      clearTimeout(showLabelTimer);
      setShowLabel(false);
      showLabelTimer = 0;
    }
  };

  return (
    <button
      onMouseEnter={() => setLebelShow(true)}
      onMouseLeave={() => setLebelShow(false)}
      onClick={() => action()}
      class="relative flex size-8 items-center justify-center rounded-full border border-transparent duration-200 hover:border-neutral-300"
    >
      <Icon name={icon} size={1.2} />

      <span
        class="absolute top-8 w-max rounded border border-neutral-200 bg-neutral-100 px-1 text-sm text-neutral-600"
        classList={{
          hidden: !showLabel(),
          block: showLabel(),
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default NoteMenuButton;
