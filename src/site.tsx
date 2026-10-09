import { useLayoutEffect, type ComponentProps, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Github, Instagram, Mail } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import moleArticle from '../content/projects/mole.md?raw'
import kivgraphArticle from '../content/projects/kivgraph.md?raw'
import qwenA10Article from '../content/projects/qwen-a10.md?raw'
import { projects, type Project, type ProjectSlug } from './projects'
import { isPagePath, pageUrl, pages, socialImage, structuredData } from './seo'

const email = 'luqueee_@outlook.es'

const technologies = {
  React: 'react_dark.svg',
  TypeScript: 'typescript.svg',
  'Node.js': 'nodejs.svg',
  Python: 'python.svg',
  Go: 'golang_dark.svg',
  MongoDB: 'mongodb-icon-dark.svg',
  Docker: 'docker.svg',
  Redis: 'redis.svg',
} as const
const articles: Record<ProjectSlug, string> = {
  mole: moleArticle,
  kivgraph: kivgraphArticle,
  'qwen-a10': qwenA10Article,
}
const markdownComponents = {
  a: ({ href, children }: ComponentProps<'a'>) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
}
type Technology = keyof typeof technologies

function TechnologyLabel({ name, inline = false }: { name: Technology; inline?: boolean }) {
  const icon = technologies[name]
  return (
    <span className={`${inline ? 'inline-mark' : 'stack-tag'} technology-label${name === 'Go' ? ' wide-logo' : ''}`}>
      <img className="technology-icon" src={`https://svgl.app/library/${icon}`} alt="" aria-hidden="true" width="15" height="15" />
      {name}
    </span>
  )
}

function ProjectList() {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <article className="project-row" key={project.name}>
          <span className="project-kind">{project.kind}</span>
          <div className="project-summary">
            <h3><Link to={project.path} viewTransition>{project.name} <ArrowRight size={18} /></Link></h3>
            <p>{project.description}</p>
            <div className="project-links">
              <Link to={project.path} viewTransition>Read story <ArrowRight size={13} /></Link>
              <a href={project.website} target="_blank" rel="noopener noreferrer">{'websiteLabel' in project ? project.websiteLabel : 'Website'} <ArrowUpRight size={13} /></a>
              <a href={project.repository} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} /></a>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [pathname])
  return null
}

function RevealOnScroll() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })

    document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight - 50) {
        element.classList.add('is-visible')
      } else {
        observer.observe(element)
      }
    })
    const frame = requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'))

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('motion-ready')
    }
  }, [pathname])
  return null
}

function PageMetadata() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    if (!isPagePath(path)) return
    const page = pages[path]
    document.title = page.title
    const metadata: Record<string, string> = {
      'description': page.description,
      'og:type': path.startsWith('/projects/') ? 'article' : 'website',
      'og:title': page.title,
      'og:description': page.description,
      'og:url': pageUrl(path),
      'og:image': socialImage,
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': socialImage,
    }
    for (const [name, content] of Object.entries(metadata)) {
      const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
      document.querySelector(selector)?.setAttribute('content', content)
    }
    document.querySelector('link[rel=\"canonical\"]')?.setAttribute('href', pageUrl(path))
    const data = document.querySelector('script[type=\"application/ld+json\"]')
    if (data) data.textContent = JSON.stringify(structuredData(path))
  }, [pathname])
  return null
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" viewTransition aria-label="luqueee, home">luqueee<span>.</span></Link>
      <nav className="top-nav" aria-label="Main navigation">
        <NavLink to="/" end viewTransition>Home</NavLink>
        <NavLink to="/projects" viewTransition>Projects</NavLink>
        <a href={`mailto:${email}`}>Contact</a>
        <span className="nav-divider" aria-hidden="true" />
        <a className="icon-link" href="https://github.com/luqueee" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} strokeWidth={1.7} /></a>
      </nav>
    </header>
  )
}

function Footer() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} luqueee</span></footer>
}

export function Home() {
  return (
    <main className="content home">
      <h1>Hey, I'm luqueee<span className="heading-period">.</span></h1>
      <p className="lead">I make things I wish already existed.</p>

      <div className="prose intro">
        <p>I'm <strong>luqueee</strong>. I like turning ideas into thoughtful digital products, paying attention to the details and learning something new along the way.</p>
        <p>I work with technologies like <TechnologyLabel name="React" inline />, <TechnologyLabel name="TypeScript" inline /> and <TechnologyLabel name="Node.js" inline />, on the frontend and behind the scenes. I believe in simple interfaces and software that's a pleasure to use.</p>
        <p>Take a look at my <Link className="text-link" to="/projects" viewTransition>projects page <ArrowUpRight size={14} /></Link> or find me through the links below.</p>
      </div>

      <section className="section featured-section reveal" aria-labelledby="featured-title">
        <div className="section-heading"><span className="section-index">01 /</span><h2 id="featured-title">Featured projects</h2></div>
        <ProjectList />
      </section>

      <section className="section reveal" aria-labelledby="experience-title">
        <div className="section-heading"><span className="section-index">02 /</span><h2 id="experience-title">Experience</h2></div>
        <div className="experience-list">
          <a className="experience-item" href="https://kenabot.xyz" target="_blank" rel="noopener noreferrer"><span className="experience-name">Kenabot <ArrowUpRight size={15} /></span></a>
          <a className="experience-item" href="https://www.nan-tic.com/es" target="_blank" rel="noopener noreferrer"><span className="experience-name">NaN-tic <ArrowUpRight size={15} /></span></a>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="stack-title">
        <div className="section-heading"><span className="section-index">03 /</span><h2 id="stack-title">Everyday tools</h2></div>
        <p className="section-description">A small selection of the technologies I build with.</p>
        <div className="stack-list" aria-label="Technologies">
          {(['TypeScript', 'React', 'Node.js', 'Python', 'Go', 'MongoDB', 'Docker', 'Redis'] as Technology[]).map((technology) => <TechnologyLabel name={technology} key={technology} />)}
        </div>
      </section>

      <section className="section connect-section reveal" aria-labelledby="connect-title">
        <div className="section-heading"><span className="section-index">04 /</span><h2 id="connect-title">Get in touch</h2></div>
        <p className="section-description">Have an idea in mind or just want to say hello? Drop me a line.</p>
        <a className="email-link" href={`mailto:${email}`}>{email} <ArrowUpRight size={19} strokeWidth={1.7} /></a>
        <div className="social-links">
          <a href="https://github.com/luqueee" target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
          <a href="https://www.instagram.com/adria.cabreraa" target="_blank" rel="noopener noreferrer"><Instagram size={16} /> Instagram <ArrowUpRight size={13} /></a>
          <a href={`mailto:${email}`}><Mail size={16} /> Email <ArrowUpRight size={13} /></a>
        </div>
      </section>
    </main>
  )
}

export function ProjectArticle({ project }: { project: Project }) {
  return (
    <main className="content project-article">
      <Link to="/projects" className="article-breadcrumb" viewTransition><ArrowRight size={14} /> All projects</Link>
      <div className="eyebrow"><span className="eyebrow-number">/ 01</span> {project.kind} <span className="eyebrow-line" /></div>
      <h1>{project.name}<span className="heading-period">.</span></h1>
      <p className="lead">{project.description}</p>
      <div className="article-actions">
        <a href={project.website} target="_blank" rel="noopener noreferrer">{'websiteLabel' in project ? project.websiteLabel : 'Website'} <ArrowUpRight size={14} /></a>
        <a href={project.repository} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
      </div>
      <article className="article-body prose">
        <ReactMarkdown components={markdownComponents}>{articles[project.slug]}</ReactMarkdown>
      </article>
      <Link to="/projects" className="back-link" viewTransition>Back to all projects <ArrowRight size={16} /></Link>
    </main>
  )
}

export function Projects() {
  return (
    <main className="content projects">
      <div className="eyebrow"><span className="eyebrow-number">/ 01</span> Selected work <span className="eyebrow-line" /></div>
      <h1>Projects<span className="heading-period">.</span></h1>
      <p className="lead">A few things I've built and shared.</p>
      <div className="reveal"><ProjectList /></div>
      <Link to="/" className="back-link" viewTransition>Back to home <ArrowRight size={16} /></Link>
    </main>
  )
}

export function SiteLayout({ children }: { children?: ReactNode }) {
  return <><ScrollToTop /><RevealOnScroll /><PageMetadata /><div className="site-shell"><Header />{children ?? <Outlet />}<Footer /></div></>
}
