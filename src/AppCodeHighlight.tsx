import React, { useEffect, useRef } from 'react';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import { highlightElement } from 'prismjs';

const AppAppCodeHighlight = (props: any) => {
  const codeElement = useRef(null);

  const propsLocal = props;

  useEffect(() => {
    if (codeElement.current) {
      highlightElement(codeElement.current);
    }
  }, []);

  return (
    <pre style={propsLocal.style}>
      <code ref={codeElement} className={`language-${propsLocal.lang}`}>
        {propsLocal.children}&nbsp;
      </code>
    </pre>
  );
};

AppAppCodeHighlight.defaultProps = {
  lang: 'jsx',
  style: null,
};

export default AppAppCodeHighlight;
