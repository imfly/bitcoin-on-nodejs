'use strict'

const voidElements = require('void-elements')
Object.keys(voidElements).forEach(function (name) {
  voidElements[name.toUpperCase()] = 1
})

const blockElements = {}
require('block-elements').forEach(function (name) {
  blockElements[name.toUpperCase()] = 1
})

/**
 * isBlockElem(node) determines if the given node is a block element.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isBlockElem (node) {
  return !!(node && blockElements[node.nodeName])
}

/**
 * isVoid(node) determines if the given node is a void element.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isVoid (node) {
  return !!(node && voidElements[node.nodeName])
}

/**
 * whitespace(elem [, isBlock]) removes extraneous whitespace from an
 * the given element. The function isBlock may optionally be passed in
 * to determine whether or not an element is a block element; if none
 * is provided, defaults to using the list of block elements provided
 * by the `block-elements` module.
 *
 * @param {Node} elem
 * @param {Function} blockTest
 */
function collapseWhitespace (elem, isBlock) {
  if (!elem.firstChild || elem.nodeName === 'PRE') return

  if (typeof isBlock !== 'function') {
    isBlock = isBlockElem
  }

  let prevText = null
  let prevVoid = false

  let prev = null
  let node = next(prev, elem)

  while (node !== elem) {
    if (node.nodeType === 3) { // Node.TEXT_NODE
      let text = node.data.replace(/[ \r\n\t]+/g, ' ')

      if ((!prevText || / $/.test(prevText.data)) &&
          !prevVoid && text[0] === ' ') {
        text = text.substr(1)
      }

      // `text` might be empty at this point.
      if (!text) {
        node = remove(node)
        continue
      }

      node.data = text
      prevText = node
    } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
      if (isBlock(node) || node.nodeName === 'BR') {
        if (prevText) {
          prevText.data = prevText.data.replace(/ $/, '')
        }

        prevText = null
        prevVoid = false
      } else if (isVoid(node)) {
        // Avoid trimming space around non-block, non-BR void elements.
        prevText = null
        prevVoid = true
      }
    } else {
      node = remove(node)
      continue
    }

    let nextNode = next(prev, node)
    prev = node
    node = nextNode
  }

  if (prevText) {
    prevText.data = prevText.data.replace(/ $/, '')
    if (!prevText.data) {
      remove(prevText)
    }
  }
}

/**
 * remove(node) removes the given node from the DOM and returns the
 * next node in the sequence.
 *
 * @param {Node} node
 * @return {Node} node
 */
function remove (node) {
  let next = node.nextSibling || node.parentNode

  node.parentNode.removeChild(node)

  return next
}

/**
 * next(prev, current) returns the next node in the sequence, given the
 * current and previous nodes.
 *
 * @param {Node} prev
 * @param {Node} current
 * @return {Node}
 */
function next (prev, current) {
  if ((prev && prev.parentNode === current) || current.nodeName === 'PRE') {
    return current.nextSibling || current.parentNode
  }

  return current.firstChild || current.nextSibling || current.parentNode
}

module.exports = collapseWhitespace
