import { createComponent } from '../common/host';
import { SVGOutput } from './output';
import { Textarea } from './textarea';
import { Toolbar } from './toolbar';

const STYLE = {
  '.body': {
    height: '100%',
    display: 'flex',
    padding: '8px',
    boxSizing: 'border-box',
    flexDirection: 'column',

    '--editor_wrapper': {
      display: 'flex',
      gap: '8px',
      flex: 1,
    }
  },
};

export const Body = createComponent((body) => {
  const host = body.host;

  body.host.styles.add('body', STYLE);

  body.node.className = 'body';

  body.dom(Toolbar);

  body.dom('div', function (wrapper) {
    wrapper.node.className = 'body--editor_wrapper';
    host.text = wrapper.dom(Textarea);
    host.output = wrapper.dom(SVGOutput);
  });
});
