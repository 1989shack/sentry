import {useCallback, useState} from 'react';
import styled from '@emotion/styled';

import {t} from 'sentry/locale';

export interface ProfileImportProps {
  children: React.ReactNode;
  onImport: (file: File) => Promise<void>;
}

function ProfileDragDropImport({
  onImport,
  children,
}: ProfileImportProps): React.ReactElement {
  const [dropState, setDropState] = useState<'idle' | 'dragover' | 'processing'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (evt: React.DragEvent<HTMLDivElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      const file = evt.dataTransfer.items[0].getAsFile();

      if (file) {
        setDropState('processing');
        onImport(file)
          .then(() => {
            setDropState('idle');
            setErrorMessage(null);
          })
          .catch(e => {
            setDropState('idle');
            setErrorMessage(e.message);
          });
      }
    },
    [onImport]
  );

  const onDragEnter = useCallback((evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setDropState('dragover');
  }, []);

  const onDragLeave = useCallback((evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setDropState('idle');
  }, []);

  // This is required to indicate that onDrop is supported on this element
  const onDragOver = useCallback((evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  }, []);

  return (
    <div onDragEnter={onDragEnter}>
      {dropState === 'idle' ? null : (
        <Overlay onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
          {t('Drop here')}
          <p>{errorMessage}</p>
        </Overlay>
      )}
      {children}
    </div>
  );
}

const Overlay = styled('div')`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid: auto/50%;
  place-content: center;
  z-index: ${p => p.theme.zIndex.modal};
  text-align: center;
`;

export {ProfileDragDropImport};
