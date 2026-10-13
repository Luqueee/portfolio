import { BackLink, Eyebrow, Lead, PageContent, PageHeading } from '../components/page'
import { ProjectList } from '../components/project-list'
import { Reveal } from '../components/reveal'

export function Projects() {
  return (
    <PageContent>
      <Eyebrow animate>Selected work</Eyebrow>
      <PageHeading animate>Projects</PageHeading>
      <Lead className="mb-0" animate>A few things I've built and shared.</Lead>
      <Reveal>
        <ProjectList className="mt-[64px] mb-[35px]" />
      </Reveal>
      <BackLink to="/" className="mb-[100px]">Back to home</BackLink>
    </PageContent>
  )
}
