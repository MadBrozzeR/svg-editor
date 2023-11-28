import { createComponent } from '../common/host';

const Line = createComponent((line, label: string) => {
  line.dom('span', { innerText: label });
  const valueBlock = line.dom('span', { innerText: '' });

  return {
    set(value: string) {
      valueBlock.node.innerText = value;
    },
  };
});

type Props = {
  className?: string;
};

export const ViewProperties = createComponent((block, props: Props = {}) => {
  const state = {
    scale: 100,
    coords: null as [number, number] | null,
  };

  block.node.className = 'view_properties' + (props.className ? (' ' + props.className) : '');

  const scale = block.dom(Line, 'scale');
  const coords = block.dom(Line, 'coords');

  const ifc = {
    set(values: Partial<typeof state>, force?: boolean) {
      if (values.scale && (force || state.scale !== values.scale)) {
        state.scale = values.scale;
        scale.set(state.scale + '%');
      }

      if (values.coords && (force || state.coords !== values.coords)) {
        state.coords = values.coords;
        coords.set(state.coords ? state.coords.join(',') : '');
      }
    },
  };

  ifc.set(state, true);

  return ifc;
});
