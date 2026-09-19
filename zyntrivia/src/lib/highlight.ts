import { createCssVariablesTheme, createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Colors come from --shiki-* variables mapped to design tokens in globals.css.
const theme = createCssVariablesTheme({
  name: 'zyntrivia',
  variablePrefix: '--shiki-',
  fontStyle: true,
})

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  bash: 'bash',
  text: 'text',
}

let highlighter: Promise<HighlighterCore> | null = null

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/sql.mjs'),
      import('shiki/langs/python.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/html.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

/** Server-side syntax highlighting; unknown languages fall back to plain text. */
export async function highlightCode(code: string, language: string): Promise<string> {
  const instance = await getHighlighter()
  const lang = LANGUAGE_ALIASES[language] ?? language
  const loaded = instance.getLoadedLanguages()
  return instance.codeToHtml(code, {
    lang: lang === 'text' || !loaded.includes(lang) ? 'text' : lang,
    theme: 'zyntrivia',
  })
}
