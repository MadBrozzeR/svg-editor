import { Splux } from 'splux';
import { Host, host } from './common/host';
import { Body } from './components/body';

const STYLE = {
  'html,body': {
    margin: 0,
    height: '100%',
  },
};

type Modifiers = Record<'shift' | 'ctrl' | 'alt' | 'cmd', boolean>;

function handleKey (keyCode: number, modifiers: Modifiers, host: Host) {
  switch (keyCode) {
    case 61: // "="
      if (modifiers.ctrl) {
        host.output?.rescale('up');
        return true;
      }
      break;
    case 31: // "-"
      if (modifiers.ctrl) {
        host.output?.rescale('down');
        return true;
      }
      break;
  }

  return false;
}

Splux.start(function (body, head) {
  const host = body.host;

  host.styles.add('main', STYLE);

  head.dom(host.styles.target);

  body.dom(Body);

  document.addEventListener('keypress', function (event) {
    const modifiers = {
      shift: event.shiftKey, alt: event.altKey, ctrl: event.ctrlKey, cmd: event.metaKey,
    };

    if (handleKey(event.keyCode, modifiers, host)) {
      event.preventDefault();
    }
  });
}, host);
