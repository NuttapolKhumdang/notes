import type { Component } from "solid-js";

type Icon_t = {
  name: string;
  size?: number;
};

const Icon: Component<Icon_t> = ({ name, size = 1.5 }) => {
  return (
    <span class="material-symbols-rounded" style={`font-size: ${size}em;`}>
      {name}
    </span>
  );
};

export default Icon;
