import { FC, useEffect } from 'react';

import { useTodo } from './hooks/useTodo';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';

export const App: FC = () => {
  const {
    todos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    editingTodo,
    setEditingTodo,
    activeTodosAmount,
    errorMessage,
    statusFilter,
    setStatusFilter,
    handleResetErrorMessage,
    handleLoadTodos,
    handleDeleteTodo,
    handleClearCompleted,
    isFocusedInput,
    newTodoTitle,
    handleNewTodoTitleChange: handleTitleChange,
    isLoadingSubmit,
    handleSubmitForm,
    handleToggleTodo,
    handleToggleAllTodos,
    handleRenameTodo,
  } = useTodo();

  useEffect(() => {
    handleResetErrorMessage();
    handleLoadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todosAmount={todosAmount}
          activeTodosAmount={activeTodosAmount}
          isFocusedInput={isFocusedInput}
          newTodoTitle={newTodoTitle}
          onTitleChange={handleTitleChange}
          isLoadingSubmit={isLoadingSubmit}
          onSubmitForm={handleSubmitForm}
          onToggleAllTodos={handleToggleAllTodos}
        />

        {!!todosAmount && (
          <>
            <TodoList
              todos={todos}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
              editingTodo={editingTodo}
              setEditingTodo={setEditingTodo}
              statusFilter={statusFilter}
              onDeleteTodo={handleDeleteTodo}
              onToggleTodo={handleToggleTodo}
              onRenameTodo={handleRenameTodo}
            />

            <TodoFooter
              leftTodos={activeTodosAmount}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              todosAmount={todosAmount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        errorMessage={errorMessage}
        onResetErrorMessage={handleResetErrorMessage}
      />
    </div>
  );
};
