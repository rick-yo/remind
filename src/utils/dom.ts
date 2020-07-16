import { debug } from './debug';
import { useEffect } from 'react';

function selectText(el?: HTMLElement) {
  if (!el) return;
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection();
    if (selection?.toString() === '') {
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
    debug('onClickOutSide', parent);
    if (!parent) {
      callback(e);
    }
  }
  document.addEventListener('click', onClickOutSide);
  return () => {
    document.removeEventListener('click', onClickOutSide);
  };
}

function useIconFont() {
  const href = 'https://at.alicdn.com/t/font_1924427_4b37bvd5e4o.css';
  useEffect(() => {
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', href);
    document.getElementsByTagName('head')[0]?.appendChild(linkElement);
    return () => {
      linkElement.remove();
    };
  }, []);
}

export { selectText, onClickOutSide, useIconFont };
