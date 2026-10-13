import mole from '../../content/projects/mole.md?raw'
import kivgraph from '../../content/projects/kivgraph.md?raw'
import qwenA10 from '../../content/projects/qwen-a10.md?raw'
import type { ProjectSlug } from './projects'

export const articles: Record<ProjectSlug, string> = {
  mole,
  kivgraph,
  'qwen-a10': qwenA10,
}
