import type { ArrayField } from 'payload'

/**
 * Tiered flow diagram, rendered in the Flow Canvas style (components/visuals/FlowDiagram).
 * Each tier connects to the next; one node can be highlighted.
 */
export function diagramField(name: string, label: string): ArrayField {
  return {
    name,
    label,
    type: 'array',
    labels: { singular: 'Tier', plural: 'Tiers' },
    admin: {
      description: 'Top-to-bottom tiers. Every node in a tier connects to the tier below.',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'nodes',
        type: 'array',
        minRows: 1,
        maxRows: 3,
        fields: [
          { name: 'label', type: 'text', required: true, maxLength: 40 },
          { name: 'detail', type: 'text', maxLength: 80 },
          { name: 'highlight', type: 'checkbox', defaultValue: false },
        ],
      },
    ],
  }
}
