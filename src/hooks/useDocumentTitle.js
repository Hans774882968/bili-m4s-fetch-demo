import { useEffect, useState } from 'react';

export default function useDocumentTitle(initialTitle = '') {
  const [title, setTitle] = useState(initialTitle || document.title);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (document.title !== title) {
        setTitle(document.title);
      }
    });

    observer.observe(document.querySelector('title'), {
      childList: true,
    });

    return () => observer.disconnect();
  }, [title]);

  return title;
};
