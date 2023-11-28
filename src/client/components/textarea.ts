import { createComponent } from '../common/host';
import { TextareaIFC } from '../common/types';

const STYLE = {
  '.textarea': {
    border: '1px solid black',
    borderRadius: '4px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',

    '--wrapper': {
      flex: 1,
      justifyItems: 'stretch',
    },
  },
};

export const Textarea = createComponent((block): TextareaIFC => {
  const host = block.host;

  host.styles.add('textarea', STYLE);

  block.node.className = 'textarea--wrapper';

  const textarea = block.dom('textarea', {
    className: 'textarea',
    onkeyup() {
      triggerUpdate();
    }
  });

  function triggerUpdate () {
    host.output?.update(textarea.node.value);
  }

  if (window.location.hash.length > 1) {
    Promise.resolve().then(function () {
      textarea.node.value = atob(window.location.hash.substring(1));
      triggerUpdate();
    });
  }

  return {
    set(value, cursorAt) {
      textarea.node.value = value;

      if (cursorAt !== undefined) {
        textarea.node.selectionStart = textarea.node.selectionEnd = cursorAt;
      }

      textarea.node.focus();

      triggerUpdate();
    },

    insert(value, cursorAt) {
      const before = textarea.node.value.substring(0, textarea.node.selectionStart);
      const after = textarea.node.value.substring(textarea.node.selectionEnd);
      textarea.node.value = before + value + after;
      textarea.node.selectionStart = textarea.node.selectionEnd =
        before.length + (cursorAt === undefined ? value.length : cursorAt);
      textarea.node.focus();

      triggerUpdate();
    }
  };
});
