import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import {
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
} from '@babel/types';
import generator from '@babel/generator';

export function getJSObjFromObjectExpression(node, evaluated) {
  // 因为没有 TS 所以没把 evaluate 的调用带进来
  if (evaluated.confident) {
    return evaluated.value;
  }
  // 假设存在 evaluate 不行而 JSON 可以的情况
  const { code: jsObjCode } = generator(node);
  try {
    return JSON.parse(jsObjCode);
  } catch (error) {
    console.error('Error parsing JS object:', error);
    return null;
  }
}

export function parsePlayInfoFromJSCode(jsCode) {
  const ast = parser.parse(jsCode);
  let playInfo = null;
  traverse(ast, {
    AssignmentExpression(path) {
      const left = path.node.left;
      if (!isMemberExpression(left)) return;
      if (!isIdentifier(left.object, { name: 'window' })) return;
      if (!isIdentifier(left.property, { name: '__playinfo__' })) return;

      const right = path.node.right;

      // Case 1: Direct object assignment
      if (isObjectExpression(right)) {
        const evaluated = path.get('right').evaluate();
        playInfo = getJSObjFromObjectExpression(right, evaluated);
        return;
      }

      // Case 2: Variable declaration
      if (isIdentifier(right)) {
        const binding = path.scope.getBinding(right.name);
        if (!binding) return;
        const init = binding.path.node.init;
        if (!isObjectExpression(init)) return;
        const evaluated = binding.path.get('init').evaluate();
        playInfo = getJSObjFromObjectExpression(init, evaluated);
        return;
      }
    },
  });
  return playInfo;
}
