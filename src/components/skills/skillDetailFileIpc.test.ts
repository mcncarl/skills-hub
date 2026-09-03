/// <reference types="node" />

import { readFileSync } from 'node:fs'
import * as ts from 'typescript'
import { describe, expect, it } from 'vitest'

const componentSource = readFileSync(
  new URL('./SkillDetailView.tsx', import.meta.url),
  'utf8',
)
const sourceFile = ts.createSourceFile(
  'SkillDetailView.tsx',
  componentSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
)

function findInvokeCall(commandName: string): ts.CallExpression {
  const matches: ts.CallExpression[] = []

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'invokeTauri'
    ) {
      const command = node.arguments[0]
      if (command && ts.isStringLiteral(command) && command.text === commandName) {
        matches.push(node)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  expect(matches).toHaveLength(1)
  const match = matches[0]
  if (!match) throw new Error(`Missing invokeTauri call for ${commandName}`)
  return match
}

function getPayload(call: ts.CallExpression): Record<string, string> {
  const payload = call.arguments[1]
  if (!payload || !ts.isObjectLiteralExpression(payload)) {
    throw new Error('Expected an inline IPC payload object')
  }

  return Object.fromEntries(
    payload.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error('Expected explicit IPC payload properties')
      }
      return [
        property.name.getText(sourceFile),
        property.initializer.getText(sourceFile),
      ]
    }),
  )
}

function getEffectDependencies(call: ts.CallExpression): string[] {
  let current: ts.Node | undefined = call.parent
  while (current) {
    if (
      ts.isCallExpression(current) &&
      ts.isIdentifier(current.expression) &&
      current.expression.text === 'useEffect'
    ) {
      const dependencies = current.arguments[1]
      if (!dependencies || !ts.isArrayLiteralExpression(dependencies)) {
        throw new Error('Expected an inline useEffect dependency array')
      }
      return dependencies.elements.map((element) => element.getText(sourceFile))
    }
    current = current.parent
  }

  throw new Error('Expected IPC call to be owned by a useEffect')
}

describe('SkillDetailView file IPC contract', () => {
  it('lists files by the managed Skill id, not by a client-supplied path', () => {
    const call = findInvokeCall('list_skill_files')

    expect(getPayload(call)).toStrictEqual({ skillId: 'skill.id' })
    expect(getEffectDependencies(call)).toContain('skill.id')
    expect(getEffectDependencies(call)).not.toContain('skill.central_path')
  })

  it('reads the selected relative file under the managed Skill id', () => {
    const call = findInvokeCall('read_skill_file')

    expect(getPayload(call)).toStrictEqual({
      skillId: 'skill.id',
      filePath: 'activeFile',
    })
    expect(getEffectDependencies(call)).toContain('skill.id')
    expect(getEffectDependencies(call)).not.toContain('skill.central_path')
  })
})
