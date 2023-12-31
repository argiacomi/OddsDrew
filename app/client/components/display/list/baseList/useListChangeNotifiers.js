import React from 'react';
import { useMessageBus } from '@utils';

const SELECTION_CHANGE_TOPIC = 'select:change-selection';
const HIGHLIGHT_CHANGE_TOPIC = 'select:change-highlight';

export default function useSelectChangeNotifiers() {
  const messageBus = useMessageBus();

  const notifySelectionChanged = React.useCallback(
    (newSelectedItems) => {
      messageBus.publish(SELECTION_CHANGE_TOPIC, newSelectedItems);
    },
    [messageBus]
  );

  const notifyHighlightChanged = React.useCallback(
    (newHighlightedItem) => {
      messageBus.publish(HIGHLIGHT_CHANGE_TOPIC, newHighlightedItem);
    },
    [messageBus]
  );

  const registerSelectionChangeHandler = React.useCallback(
    (handler) => {
      return messageBus.subscribe(SELECTION_CHANGE_TOPIC, handler);
    },
    [messageBus]
  );

  const registerHighlightChangeHandler = React.useCallback(
    (handler) => {
      return messageBus.subscribe(HIGHLIGHT_CHANGE_TOPIC, handler);
    },
    [messageBus]
  );

  return {
    notifySelectionChanged,
    notifyHighlightChanged,
    registerSelectionChangeHandler,
    registerHighlightChangeHandler
  };
}
