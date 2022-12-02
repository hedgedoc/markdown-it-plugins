/*
 * SPDX-FileCopyrightText: Original: (c) 2018 Fabio Zendhi Nagao / Modifications: (c) 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: MIT
 */

export interface TocAst {
  level: number
  name: string
  children: TocAst[]
}
