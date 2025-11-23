"use client"

import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import type { Language } from "prism-react-renderer"
import theme from "@/lib/codeblockTheme"

type Props = {
    code: string
    language?: Language | any
}

export function CodeBlock({ code, language = "tsx" }: Props) {
    return (
        <Highlight {...(defaultProps as any)} theme={theme} code={code} language={language as any}>
            {(renderProps: any) => {
                const { className, style, tokens, getLineProps, getTokenProps } = renderProps
                return (
                    <div className="max-h-[70vh]  overflow-x-auto" onWheel={(e) => e.stopPropagation()}>
                        <pre className={`${className}  p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words`} style={style}>
                            {tokens.map((line: any, i: number) => {
                                const lineNumber = i + 1
                                const { key: _lk, ...lineProps } = getLineProps({ line, key: i })
                                return (
                                    <div
                                        key={i}
                                        {...lineProps}
                                        className="flex gap-2 sm:gap-4 items-start bg-transparent"
                                    >
                                        <div className="select-none text-muted-foreground/50 w-8 sm:w-12 text-right pr-2 sm:pr-3 text-[10px] sm:text-xs">{String(lineNumber).padStart(3, "0")}</div>
                                        <div className="flex-1 min-w-0">
                                            {line.map((token: any, idx: number) => {
                                                const { key: _tk, ...tokenProps } = getTokenProps({ token, key: idx })
                                                return <span key={idx} {...tokenProps} />
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </pre>
                    </div>
                )
            }}
        </Highlight>
    )
}

export default CodeBlock
