/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  FC,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
} from 'react';
import cn from 'classnames';
import './TodoItem.scss';

import { Todo } from '../../types';

interface Props {
  todo: Todo;
  editingTodo?: Todo | null;
  setEditingTodo?: Dispatch<SetStateAction<Todo | null>>;
  loadingTodoIds?: number[];
  onDeleteTodo?: (todoId: Todo['id']) => void;
  onToggleTodo?: (
    todoId: Todo['id'],
    isTodoCompleted: Todo['completed'],
  ) => void;
  onRenameTodo?: (todo: Todo, newTitle: string) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  editingTodo,
  setEditingTodo = () => {},
  loadingTodoIds,
  onDeleteTodo = () => {},
  onToggleTodo = () => {},
  onRenameTodo = () => {},
}) => {
  const { id, completed, title } = todo;

  const [updatedTitle, setUpdatedTitle] = useState('');
  const isBeingEditing = editingTodo?.id === id;
  const isLoading = id === 0 ? true : loadingTodoIds?.includes(id);
  const titleField = useRef<HTMLInputElement>(null);

  document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setUpdatedTitle(title);
    }
  });

  const handleRenameTodoFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRenameTodo(todo, updatedTitle.trim());
  };

  useEffect(() => {
    if (isBeingEditing) {
      titleField.current?.focus();
    }
  }, [isBeingEditing]);

  useEffect(() => {
    setUpdatedTitle(title);
  }, [title]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggleTodo(id, completed)}
        />
      </label>

      {isBeingEditing ? (
        <form onSubmit={handleRenameTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleField}
            value={updatedTitle}
            onChange={event => setUpdatedTitle(event.target.value)}
            onBlur={() => onRenameTodo(todo, updatedTitle.trim())}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodo(todo)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
