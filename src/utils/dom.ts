import { debug } from './debug';

function selectText(el?: HTMLElement) {
  if (!el) return;
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection();
    if (selection?.toString() == '') {
      //no text selection
      setTimeout(function() {
        const range = document.createRange(); //range object
        range.selectNodeContents(el); //sets Range
        selection.removeAllRanges(); //remove all ranges from selection
        selection.addRange(range); //add Range to a Selection.
      }, 1);
    }
  }
}

function onClickOutSide(selector: string, callback: Function) {
  function onClickOutSide(e: MouseEvent) {
    // @ts-ignore
    const parent = e.target?.closest(selector);
    debug('onClickOutSide', parent)
    if (!parent) {
      callback(e);
    }
  }
  document.addEventListener('click', onClickOutSide);
  return () => {
    document.removeEventListener('click', onClickOutSide);
  };
}

export { selectText, onClickOutSide };
