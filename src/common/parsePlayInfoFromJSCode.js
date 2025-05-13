import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import {
  isIdentifier,
  isMemberExpression,
  isNumericLiteral,
  isObjectExpression,
  isStringLiteral,
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
    return {};
  }
}

export function resolveMemberExpressionRight(path, scope) {
  const propertyAccessChain = [];
  let currentPath = path;
  let baseObject = null;

  // 1. 收集属性访问链
  while (currentPath.isMemberExpression()) {
    const property = currentPath.get('property').node;

    // 获取属性名（支持标识符、字符串和数字字面量）
    let propertyName = null;
    if (isIdentifier(property)) {
      propertyName = property.name;
    } else if (isStringLiteral(property)) {
      propertyName = property.value;
    } else if (isNumericLiteral(property)) {
      propertyName = property.value;
    } else {
      return null; // 不支持的属性类型
    }

    propertyAccessChain.unshift(propertyName);
    currentPath = currentPath.get('object');
  }

  // 2. 获取基础对象
  if (currentPath.isIdentifier()) {
    const binding = scope.getBinding(currentPath.node.name);
    if (!binding) return null;
    const init = binding.path.node.init;
    if (!isObjectExpression(init)) {
      return null;
    }
    const evaluated = binding.path.get('init').evaluate();
    baseObject = getJSObjFromObjectExpression(init, evaluated);
  } else if (currentPath.isObjectExpression()) {
    const evaluated = currentPath.evaluate();
    baseObject = getJSObjFromObjectExpression(currentPath.node, evaluated);
  } else {
    return null; // 不支持的类型
  }

  // 3. 按照属性链访问对象
  let result = baseObject;
  for (const prop of propertyAccessChain) {
    if (result && typeof result === 'object' && prop in result) {
      result = result[prop];
    } else {
      return null; // 属性访问失败。实际值是 undefined 但我们返回 null
    }
  }

  return result;
}

export function parsePlayInfoFromJSCode(jsCode) {
  const ast = parser.parse(jsCode);
  let playInfo = {};
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

      // Case 2: Variable assignment (identifier)
      if (isIdentifier(right)) {
        const binding = path.scope.getBinding(right.name);
        if (!binding) return;
        const init = binding.path.node.init;
        if (!isObjectExpression(init)) return;
        const evaluated = binding.path.get('init').evaluate();
        playInfo = getJSObjFromObjectExpression(init, evaluated);
        return;
      }

      // Case 3: Variable assignment (member expression, nested property access)
      if (isMemberExpression(right)) {
        playInfo = resolveMemberExpressionRight(path.get('right'), path.scope);
        return;
      }
    },
  });
  return playInfo;
}
