export const pageProps = [
  { key: 'name', type: 'macro', display: 'Page Name' },
  { key: 'text', type: 'macro', display: 'Question Text' },
  { key: 'repeatVar', type: 'string', display: 'Counting Variable' },
  { key: 'outerLoopVar', type: 'string', display: 'Outer Loop Variable' },
  { key: 'learn', type: 'macro', display: 'LearnMore Prompt' },
  { key: 'help', type: 'macro', display: 'LearnMore Response' },
  { key: 'helpReader', type: 'macro', display: 'Video Transcript' },
  { key: 'codeBefore', type: 'logic', display: 'Before Logic' },
  { key: 'codeAfter', type: 'logic', display: 'After Logic' }
]

export const fieldProps = [
  { key: 'label', type: 'macro', display: 'Field Label' },
  { key: 'name', type: 'string', display: 'Field Variable' },
  { key: 'value', type: 'macro', display: 'Field Default Value' },
  { key: 'invalidPrompt', type: 'macro', display: 'Field Custom Invalid Prompt' },
  { key: 'sample', type: 'macro', display: 'Field Sample Value' }
]

export const buttonProps = [
  { key: 'label', type: 'macro', display: 'Button Label' },
  { key: 'name', type: 'string', display: 'Button Variable Name' },
  { key: 'value', type: 'macro', display: 'Button Default Value' },
  { key: 'repeatVar', type: 'string', display: 'Button Counting Variable' },
  { key: 'url', type: 'macro', display: 'Button URL' }
]
