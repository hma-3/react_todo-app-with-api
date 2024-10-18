import { useCallback, useState } from 'react';
import { ErrorMessages } from '../types';

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.DEFAULT,
  );

  const handleResetErrorMessage = useCallback(
    () => setErrorMessage(ErrorMessages.DEFAULT),
    [],
  );

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);
    setTimeout(handleResetErrorMessage, 3000);
  };

  return { errorMessage, handleError, handleResetErrorMessage };
};
