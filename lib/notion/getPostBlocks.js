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

export async function getPostBlocks (id) {
  const pageBlock = await api.getPage(id)
  normalizeRecordMap(pageBlock)
  return pageBlock
}
