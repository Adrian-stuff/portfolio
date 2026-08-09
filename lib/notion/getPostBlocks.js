import api from '@/lib/server/notion-api'

/**
 * Notion's API now wraps record entries in one of two new shapes:
 *   { spaceId, value: { role, value: BlockData } }   (outer spaceId wrapper)
 *   { value: { role, value: BlockData } }             (no spaceId, just extra nesting)
 *
 * react-notion-x expects the old format:
 *   { role, value: BlockData }
 *
 * Rule: if entry.value.value.id exists (meaning BlockData is doubly nested),
 * unwrap one level: entry → entry.value.
 */
function normalizeRecordMap (recordMap) {
  for (const table of ['block', 'collection', 'collection_view', 'notion_user', 'signed_urls']) {
    const entries = recordMap?.[table]
    if (!entries) continue
    for (const id of Object.keys(entries)) {
      const entry = entries[id]
      // Block data is doubly nested when entry.value.value.id is present but entry.value.id is not
      if (entry?.value?.value?.id != null && entry?.value?.id == null) {
        entries[id] = entry.value
      }
    }
  }
  return recordMap
}

function enhanceAboutPage (recordMap) {
  const pageId = '2f9dfb2b-64f8-8109-af52-c558419c3e50'
  const pageIdShort = '2f9dfb2b64f88109af52c558419c3e50'
  const blocks = recordMap?.block
  if (!blocks) return recordMap

  const pKey = blocks[pageId] ? pageId : blocks[pageIdShort] ? pageIdShort : null
  if (!pKey) return recordMap

  const pageVal = blocks[pKey]?.value
  if (!pageVal) return recordMap

  // 1. Update tagline text block
  const taglineId = '665958ab-4f96-4dc0-9463-153411b137af'
  if (blocks[taglineId]?.value) {
    blocks[taglineId].value.properties = {
      title: [
        [
          'I build scalable web applications, autonomous AI agents, and agentic workflows that solve real-world engineering problems.'
        ]
      ]
    }
  }

  // 2. Add AI & Agentic Development to Tech Stack
  const aiTechBlockId = 'ai-agentic-tech-stack-block'
  blocks[aiTechBlockId] = {
    role: 'editor',
    value: {
      id: aiTechBlockId,
      version: 1,
      type: 'bulleted_list',
      properties: {
        title: [
          ['AI & Agentic Dev:', [['b']]],
          [' Agentic workflows, autonomous AI agents, LLM tool-calling & agent orchestration']
        ]
      },
      created_time: Date.now(),
      last_edited_time: Date.now(),
      parent_id: pKey,
      parent_table: 'block',
      alive: true
    }
  }

  // 3. Add Agentic Workflows & AI Development to "What I do"
  const agenticTitleId = 'agentic-workflows-title-block'
  const agenticDescId = 'agentic-workflows-desc-block'

  blocks[agenticTitleId] = {
    role: 'editor',
    value: {
      id: agenticTitleId,
      version: 1,
      type: 'text',
      properties: {
        title: [['Agentic Workflows & AI Development', [['b']]]]
      },
      created_time: Date.now(),
      last_edited_time: Date.now(),
      parent_id: pKey,
      parent_table: 'block',
      alive: true
    }
  }

  blocks[agenticDescId] = {
    role: 'editor',
    value: {
      id: agenticDescId,
      version: 1,
      type: 'text',
      properties: {
        title: [
          [
            'I design and engineer autonomous AI agents, tool-calling multi-agent systems, and customized agentic workflows to automate complex software engineering processes, research, and data integration pipelines.'
          ]
        ]
      },
      created_time: Date.now(),
      last_edited_time: Date.now(),
      parent_id: pKey,
      parent_table: 'block',
      alive: true
    }
  }

  const content = pageVal.content || []

  // Insert AI Tech Stack bullet right after Infrastructure bullet
  const infraIdx = content.indexOf('280b0742-3864-40cb-9e4c-c106aee67575')
  if (infraIdx !== -1 && !content.includes(aiTechBlockId)) {
    content.splice(infraIdx + 1, 0, aiTechBlockId)
  }

  // Insert Agentic Workflows under What I do right after HOACentralPH project text
  const hoaDescIdx = content.indexOf('103d20bb-be02-438c-917b-9272d14ba60b')
  if (hoaDescIdx !== -1 && !content.includes(agenticTitleId)) {
    content.splice(hoaDescIdx + 1, 0, agenticTitleId, agenticDescId)
  }

  return recordMap
}

const defaultGotOptions = {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  }
}

export async function getPostBlocks (id) {
  const pageBlock = await api.getPage(id, { gotOptions: defaultGotOptions })
  normalizeRecordMap(pageBlock)
  enhanceAboutPage(pageBlock)
  return pageBlock
}
