import { createComponent } from '../common/host';
import { SVGOutputIFC } from '../common/types';
import { ViewProperties } from './view-properties';

const STYLE = {
  '.svg_output': {
    border: '1px solid black',
    transform: 'scale(var(--scale, 1))',
    cursor: 'crosshair',

    '_error': {
      opacity: 0.3,
    },

    '--wrapper': {
      flex: 1,
      justifyItems: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    '--properties': {
      position: 'absolute',
      bottom: '5px',
      left: '5px',
    }
  },
};

type ImageProps = {
  onMouseMove: (coords: [number, number]) => void;
};

const TRACKER_DISABLE_DELAY = 2000;
const MIN_SCALE = 1;
const MAX_SCALE = 20;

const Image = createComponent('img', (image, { onMouseMove }: ImageProps) => {
  let isTrackerEnabled = true;
  let lastSrc = 'data:image/svg+xml;base64,';

  image.setParams({
    className: 'svg_output',
    onmousemove: function (event) {
      if (isTrackerEnabled) {
        onMouseMove([event.offsetX, event.offsetY]);
      }
    },
    onclick: function () {
      isTrackerEnabled = false;

      setTimeout(function () {
        isTrackerEnabled = true;
      }, TRACKER_DISABLE_DELAY);
    },
    onerror: function (error) {
      image.node.src = lastSrc;
      image.node.classList.add('svg_output_error');
    }
  });

  return {
    set(value: string) {
      const data = btoa(value);
      lastSrc = image.node.src;
      image.node.classList.remove('svg_output_error');
      image.node.src = 'data:image/svg+xml;base64,' + data;
      window.location.hash = data;
    },
    rescale(value: number) {
      image.node.style.setProperty('--scale', value.toString());
    },
  };
});

export const SVGOutput = createComponent(function (block): SVGOutputIFC {
  block.host.styles.add('svg-output', STYLE);

  let scale = 1;

  block.node.className = 'svg_output--wrapper';

  function handleImageMouseMove (coords: [number, number]) {
    properties.set({ coords });
  }

  const img = block.dom(Image, { onMouseMove: handleImageMouseMove });
  const properties = block.dom(ViewProperties, { className: 'svg_output--properties' });

  return {
    update(value) {
      img.set(value);
    },
    rescale(direction) {
      if (direction === 'up') {
        if (++scale > MAX_SCALE) {
          scale = MAX_SCALE;
        };
      } else {
        if (--scale < MIN_SCALE) {
          scale = MIN_SCALE;
        };
      }

      img.rescale(scale);
      properties.set({ scale: scale * 100 });
    }
  };
});
