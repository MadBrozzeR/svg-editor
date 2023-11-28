import { createComponent } from '../common/host';

const STYLE = {
  '.toolbar': {
    height: '32px',

    '--button': {
      border: '1px solid black',
      borderRadius: '4px',
      padding: '4px 8px',
      backgroundColor: '#ddf',
      cursor: 'pointer',
      marginRight: '2px',
    },
  },
};

const INITIAL = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="126px" height="126px" viewBox="0 0 126 126">

</svg>`;

const BUTTONS = {
  'init': { set: INITIAL, pos: INITIAL.length - 7 },
  'circle': { insert: '<circle cx="" cy="" r="" />', pos: 12 },
  'rect': { insert: '<rect x="" y="" width="" height="" rx="" ry="" />', pos: 9 },
  'line': { insert: '<line x1="" y1="" x2="" y2="" stroke="black" />', pos: 10 },
  'path': { insert: '<path d="" />', pos: 9 },
  'polygon': { insert: '<polygon points="" />', pos: 17 },
  'polyline': { insert: '<polyline points="" />', pos: 18 },
  'text': { insert: '<text x="" y=""></text>', pos: 9 },
  'image': { insert: '<image href="" x="" y="" height="" width="" />', pos: 13 },
};

type Buttons = typeof BUTTONS;

function createButton (params: Buttons[keyof Buttons], key: keyof Buttons) {
  return createComponent('button', (button) => {
    const host = button.host;

    button.setParams({
      className: 'toolbar--button',
      innerText: key.toString(),
      onclick(event) {
        event.preventDefault();

        host.broadcast?.({ type: 'Hello,', payload: 'World!' });

        if ('set' in params) {
          host.text?.set(params.set, params.pos);
        }

        if ('insert' in params) {
          host.text?.insert(params.insert, params.pos);
        }
      }
    })
  });
}

function isKeyOfButtons (key: string): key is keyof Buttons {
  return BUTTONS.hasOwnProperty(key);
}

export const Toolbar = createComponent((toolbar) => {
  toolbar.host.styles.add('toolbar', STYLE);

  toolbar.node.className = 'toolbar';

  for (const key in BUTTONS) {
    if (isKeyOfButtons(key)) {
      toolbar.dom(createButton(BUTTONS[key], key));
    }
  }
});
