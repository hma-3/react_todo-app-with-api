import { useState } from 'react';

export const useNewTodo = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoadingNewTodoSubmit, setIsLoadingNewTodoSubmit] = useState(false);
  const [isFocusedNewTodoInput, setIsFocusedNewTodoInput] = useState(true);

  return {
    newTodoTitle,
    setNewTodoTitle,
    isLoadingNewTodoSubmit,
    setIsLoadingNewTodoSubmit,
    isFocusedNewTodoInput,
    setIsFocusedNewTodoInput,
  };
};
