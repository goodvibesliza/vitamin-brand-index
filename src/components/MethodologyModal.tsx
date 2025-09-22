import { useEffect, useRef, useState } from 'react';

export default function MethodologyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = () => {
    // Store the element that triggered the modal for focus return
    triggerRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Return focus to the trigger element
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the first focusable element or the dialog itself
      const firstFocusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus();
      } else {
        dialog.focus();
      }
    } else {
      dialog.close();
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!isInDialog) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      dialog.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      dialog.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Expose open method globally for MethodologyLink to use
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      (dialog as any).open = open;
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      data-methodology-modal
      className="methodology-modal"
      aria-labelledby="methodology-title"
      aria-modal="true"
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="methodology-title">Methodology</h2>
          <button 
            type="button" 
            onClick={close}
            className="modal-close"
            aria-label="Close methodology modal"
          >
            ×
          </button>
        </header>
        
        <div className="modal-body">
          <iframe
            src="/methodology"
            title="Methodology content"
            className="methodology-iframe"
            loading="lazy"
          />
        </div>
      </div>

      <style jsx>{`
        .methodology-modal {
          max-width: 90vw;
          max-height: 90vh;
          width: 800px;
          height: 600px;
          border: none;
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          background: white;
        }

        .methodology-modal::backdrop {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: #666;
        }

        .modal-close:hover {
          background: #f5f5f5;
          color: #000;
        }

        .modal-close:focus {
          outline: 2px solid #0066cc;
          outline-offset: 2px;
        }

        .modal-body {
          flex: 1;
          overflow: hidden;
        }

        .methodology-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .methodology-modal {
            max-width: 95vw;
            max-height: 95vh;
            width: 95vw;
            height: 95vh;
            margin: auto;
          }
          
          .modal-header {
            padding: 1rem;
          }
          
          .modal-header h2 {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .methodology-modal {
            max-width: 100vw;
            max-height: 100vh;
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </dialog>
  );
}