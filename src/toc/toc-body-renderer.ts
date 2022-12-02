/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: MIT
 */

import { encode as htmlencode } from 'html-entities'
import { TocAst } from './toc-ast.js'
import { TocOptions } from './toc-options.js'

/**
 * Renders a HTML listing of the given tree.
 *
 * @param tree The tree that should be represented as HTML tree
 * @param tocOptions additional options that configure the rendering
 */
export function renderAstToHtml(tree: TocAst, tocOptions: TocOptions): string {
  const usedSlugs: string[] = []

  const listClass = tocOptions.listClass !== '' ? ` class="${htmlencode(tocOptions.listClass)}"` : ''
  const itemClass = tocOptions.itemClass !== '' ? ` class="${htmlencode(tocOptions.itemClass)}"` : ''
  const linkClass = tocOptions.linkClass !== '' ? ` class="${htmlencode(tocOptions.linkClass)}"` : ''

  if (tree.children.length === 0) {
    return ''
  }

  let buffer = ''
  if (tree.level === 0 || isLevelSelected(tree.level, tocOptions.level)) {
    buffer += `<${htmlencode(tocOptions.listType) + listClass}>`
  }
  buffer += tree.children.reduce((state, node) => {
    const subNodesHtml = renderAstToHtml(node, tocOptions)
    if (isLevelSelected(node.level, tocOptions.level)) {
      const anchorContent = htmlencode(tocOptions.format?.(node.name) ?? node.name)
      const anchorId = generateUniqueSlug(node.name, tocOptions, usedSlugs)
      return state + `<li${itemClass}><a${linkClass} href="#${anchorId}">${anchorContent}</a>${subNodesHtml}</li>`
    } else {
      return state + subNodesHtml
    }
  }, '')
  if (tree.level === 0 || isLevelSelected(tree.level, tocOptions.level)) {
    buffer += `</${htmlencode(tocOptions.listType)}>`
  }
  return buffer
}

function isLevelSelected(level: number, levels: number | number[]): boolean {
  return Array.isArray(levels) ? levels.includes(level) : level >= levels
}

function generateUniqueSlug(slug: string, tocOptions: TocOptions, usedSlugs: string[]): string {
  let index = tocOptions.uniqueSlugStartIndex
  while (index < Number.MAX_VALUE) {
    const slugCandidate: string = tocOptions.slugify(slug, index)
    const slugWithIndex = index === 0 ? slugCandidate : `${slugCandidate}-${index}`

    if (usedSlugs.includes(slugWithIndex)) {
      index += 1
    } else {
      usedSlugs.push(slugWithIndex)
      return slugWithIndex
    }
  }
  throw new Error('Too many slug with same name')
}
