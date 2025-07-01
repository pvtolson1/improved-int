import {
  TLStoreSnapshot,
  createShapeId,
  TLShape,
  TLArrowShape,
  type TLParentId,
  IndexKey,
} from '@tldraw/tldraw'

import { createTLSchema } from '@tldraw/tlschema'

const schema = createTLSchema()


export interface DiagramNode {
  id: string    // e.g. "1", "2", "3"
  type: string  // e.g. "box"
  text: string
}

export interface Connector {
  from: string  // must match one of the node.id values
  to: string
}

/**
 * Build only the minimal records map for tldraw.
 * We key each node shape by its original node.id so connectors resolve.
 */
export function buildTldrawDocument(
  nodes: DiagramNode[],
  connectors: Connector[],
  style: string
): { records: Record<string, any> } {
  const shapes: Record<string, any> = {}

  // 1) Use node.id as the shape key/ID
  for (const node of nodes) {
    shapes[node.id] = {
      id: node.id,
      type: node.type,
      parentId: 'page' as TLParentId,
      childIndex: 1,
      x: Math.random() * 200,
      y: Math.random() * 200,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      meta: {},
      style: { shape: style },
      props: {},
    }
  }

  // 2) Create arrow shapes, now shapes[from] is defined
  for (const { from, to } of connectors) {
    const arrowId = createShapeId()
    const fromShape = shapes[from]
    const toShape   = shapes[to]

    shapes[arrowId] = {
      id: arrowId,
      type: 'arrow',
      parentId: 'page' as TLParentId,
      childIndex: 2,
      x: fromShape.x,
      y: fromShape.y,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      meta: {},
      handles: [
        {
          id: 'start',
          type: 'binding',
          index: 0,
          isExact: true,
          x: fromShape.x,
          y: fromShape.y,
        },
        {
          id: 'end',
          type: 'binding',
          index: 0,
          isExact: true,
          x: toShape.x,
          y: toShape.y,
        },
      ],
      style: { dash: 'solid', size: 1, color: 'black' },
      props: { end: { id: to, index: 0 } },
    }
  }

  return { records: shapes }
}