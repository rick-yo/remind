import { debug } from './debug';
import { useEffect, DependencyList, RefObject } from 'react';

function selectText(el?: HTMLElement) {
  if (!el) return;
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection();
    if (selection?.toString() === '') {
      //no text selection
      setTimeout(function () {
        const range = document.createRange(); //range object
        range.selectNodeContents(el); //sets Range
        selection.removeAllRanges(); //remove all ranges from selection
        selection.addRange(range); //add Range to a Selection.
      }, 1);
    }
  }
}

function useClickOutSide(
  selector: string,
  callback: (e: MouseEvent) => void,
  deps: DependencyList
) {
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      // @ts-ignore
      const parent = e.target?.closest(selector);
      debug('onClickOutSide event fired');
      if (!parent) {
        callback(e);
      }
    }
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [selector, callback, ...deps]);
}

function useIconFont() {
  const href = 'https://at.alicdn.com/t/font_1924427_4b37bvd5e4o.css';
  useEffect(() => {
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', href);
    document.querySelector('head')?.appendChild(linkElement);
    return () => {
      linkElement.remove();
    };
  }, []);
}

function usePassiveWheelEvent(
  ref: RefObject<HTMLElement> | null,
  callback: (e: WheelEvent) => void
) {
  useEffect(() => {
    ref?.current?.addEventListener('wheel', callback, {
      passive: false,
    });
    return () => {
      ref?.current?.removeEventListener('wheel', callback);
    };
  }, [ref, callback]);
}

export { selectText, useClickOutSide, useIconFont, usePassiveWheelEvent };
