import { createSignal, Match, Switch, type Component } from "solid-js";
import Icon from "../Icon";

export const TagLabel: Component<{ label: string }> = ({ label }) => {
  return (
    <span class="size-max rounded border border-neutral-200 bg-neutral-100 px-1 text-sm">
      {label}
    </span>
  );
};

type noteTagSelectorItem_t = {
  checked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
};

export const NoteTagSelectorItem: Component<noteTagSelectorItem_t> = ({
  checked = false,
  label,
  onChange = (c) => null,
}) => {
  console.log(label, checked);
  
  const [isChecked, setChecked] = createSignal<boolean>(checked);

  return (
    <label
      onClick={() => {
        setChecked(!isChecked());
        onChange(isChecked());
      }}
      class="flex flex-row items-center gap-1"
    >
      <span class="flex flex-row items-center justify-center">
        <Switch>
          <Match when={isChecked()}>
            <Icon name="check_box" size={1.2} />
          </Match>
          <Match when={!isChecked()}>
            <Icon name="check_box_outline_blank" size={1.2} />
          </Match>
        </Switch>
      </span>

      <span class="text-sm">{label}</span>
    </label>
  );
};
