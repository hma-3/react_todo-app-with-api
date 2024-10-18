import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorMessages, StatusFilter, Todo } from '../types';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { useNewTodo } from './useNewTodo';
import { countLeftTodos, getCompletedTodoIds } from '../utils';
import { useError } from './useError';

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const {
    newTodoTitle,
    handleNewTodoTitleChange,
    tempTodo,
    handleAddTempTodo,
    handleResetTempTodo,
    resetNewTodoTitle,
    isLoadingNewTodoSubmit,
    setIsLoadingNewTodoSubmit,
    isFocusedNewTodoInput,
    setIsFocusedNewTodoInput,
  } = useNewTodo();

  const { errorMessage, handleError, handleResetErrorMessage } = useError();

  const todosAmount = todos.length;
  const activeTodosAmount = useMemo(() => countLeftTodos(todos), [todos]);
  const completedTodoIds = useMemo(() => getCompletedTodoIds(todos), [todos]);

  // Get Todos
  const handleLoadTodos = () => {
    getTodos()
      .then(currentTodos => {
        setTodos(currentTodos);
      })
      .catch(() => handleError(ErrorMessages.LOADING_TODOS));
  };

  // Delete One Todo
  const handleDeleteTodo = (todoId: Todo['id']) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(curTodo => curTodo.id !== todoId),
        );

        if (editingTodo) {
          setEditingTodo(null);
        }
      })
      .catch(() => handleError(ErrorMessages.DELETING_TODO))
      .finally(() =>
        setLoadingTodoIds(ids => ids.filter(currentId => currentId !== todoId)),
      );
  };

  // Delete All Completed Todos
  const handleClearCompleted = useCallback(() => {
    completedTodoIds.forEach(id => handleDeleteTodo(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedTodoIds]);

  //Add New Todo on Submit
  const handleAddTodoFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle.length) {
      handleError(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsLoadingNewTodoSubmit(true);
    handleAddTempTodo({ ...newTodo, id: 0 });
    setIsFocusedNewTodoInput(false);

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        resetNewTodoTitle();
      })
      .catch(() => handleError(ErrorMessages.ADDING_TODO))
      .finally(() => {
        setIsLoadingNewTodoSubmit(false);
        handleResetTempTodo();
        setIsFocusedNewTodoInput(true);
      });
  };

  // Update Todo
  const handleUpdateTodo = (
    todoId: Todo['id'],
    { ...todoData }: Partial<Todo>,
  ) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    updateTodo({ id: todoId, ...todoData })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );

        setEditingTodo(null);
      })
      .catch(() => {
        handleError(ErrorMessages.UPDATING_TODO);
        setTodos(currentTodos =>
          currentTodos === todos ? currentTodos : todos,
        );
      })
      .finally(() => setLoadingTodoIds(ids => ids.filter(id => id !== todoId)));
  };

  // Toggle Todo Status
  const handleToggleTodo = (
    todoId: Todo['id'],
    isTodoCompleted: Todo['completed'],
  ) => {
    handleUpdateTodo(todoId, { completed: !isTodoCompleted });
  };

  // Toggle All Todos Status
  const handleToggleAllTodos = () => {
    todos.forEach(todo => {
      if (todo.completed === !activeTodosAmount) {
        handleUpdateTodo(todo.id, { completed: !!activeTodosAmount });
      }
    });
  };

  // Rename Todo
  const handleRenameTodo = ({ id, title }: Todo, newTitle: string) => {
    if (!newTitle.length) {
      handleDeleteTodo(id);

      return;
    }

    if (newTitle === title) {
      setEditingTodo(null);

      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    );

    handleUpdateTodo(id, { title: newTitle });
  };

  // Load Todos
  useEffect(() => {
    handleResetErrorMessage();
    handleLoadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    todos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    editingTodo,
    setEditingTodo,
    activeTodosAmount,
    errorMessage,
    handleResetErrorMessage,
    statusFilter,
    setStatusFilter,
    handleDeleteTodo,
    handleClearCompleted,
    isFocusedNewTodoInput,
    newTodoTitle,
    handleNewTodoTitleChange,
    isLoadingNewTodoSubmit,
    handleAddTodoFormSubmit,
    handleToggleTodo,
    handleToggleAllTodos,
    handleRenameTodo,
  };
};
