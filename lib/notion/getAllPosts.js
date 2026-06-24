import { config as BLOG } from '@/lib/server/config'

import { idToUuid } from 'notion-utils'
import dayjs from 'dayjs'
import api from '@/lib/server/notion-api'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  const pageId = idToUuid(process.env.NOTION_PAGE_ID)

  const response = await api.getPage(pageId)

  // Notion API now nests block data as block[id].value.value (not block[id].value)
  const rootBlock = response.block?.[pageId]?.value?.value

  // Check Type
  if (
    rootBlock?.type !== 'collection_view_page' &&
    rootBlock?.type !== 'collection_view'
  ) {
    console.log(`pageId "${pageId}" is not a database`)
    return []
  }

  // Collection schema is also double-nested: collection[id].value.value.schema
  const collectionEntry = Object.values(response.collection || {})[0]
  const schema = collectionEntry?.value?.value?.schema

  // getPage no longer auto-populates collection_query — call getCollectionData directly
  const collectionId = rootBlock.collection_id
  const viewId = rootBlock.view_ids?.[0]
  const collData = await api.getCollectionData(collectionId, viewId, {})

  const pageIds = collData.result?.reducerResults?.collection_group_results?.blockIds || []
  const block = collData.recordMap?.block || {}

  // Construct Data
  const data = []
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const blockValue = block[id]?.value?.value

    // Skip CRDT-only blocks — they have no properties and can't be decoded
    if (!blockValue?.properties) continue

    const properties = (await getPageProperties(id, block, schema)) || null
    if (!properties) continue

    // Add fullwidth to properties
    properties.fullWidth = blockValue.format?.page_full_width ?? false
    // Convert date (with timezone) to unix milliseconds timestamp
    properties.date = (
      properties.date?.start_date
        ? dayjs.tz(properties.date?.start_date)
        : dayjs(blockValue.created_time)
    ).valueOf()

    data.push(properties)
  }

  // remove all the items that don't meet requirements
  const posts = filterPublishedPosts({ posts: data, includePages })

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => b.date - a.date)
  }
  return posts
}
