import { ArrowUpRight, Github, Instagram, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { email, everydayTechnologies, experience, socialLinks } from '../data/profile'
import { ExternalLink } from '../components/external-link'
import { Lead, PageContent, PageHeading } from '../components/page'
import { ProjectList } from '../components/project-list'
import { Section } from '../components/section'
import { TechnologyLabel } from '../components/technology-label'
import { KenabotFeature } from '../components/kenabot-feature'
import { NowPlaying } from '../components/now-playing'

const contacts = Object.values(socialLinks)
const socialIcons = { github: Github, instagram: Instagram, email: Mail }
const sectionDescriptionClasses = 'mt-[17px] mr-0 mb-[22px] ml-[45px] text-[14px] leading-[1.7] text-muted max-[641px]:ml-0'
const socialLinkClasses = 'inline-flex items-center gap-[6px] text-[13px] font-semibold transition-[color,translate] duration-[200ms,300ms] ease-[ease,var(--ease-editorial)] hover:-translate-y-[2px] hover:text-accent motion-safe:duration-[200ms,250ms,120ms] motion-safe:transition-[color,translate,scale] motion-safe:ease-[ease,var(--ease-editorial),ease] motion-safe:active:scale-[.97] motion-reduce:transition-none'

export function Home() {
  return (
    <PageContent>
      <PageHeading animate>Hey, I'm luqueee</PageHeading>
      <Lead animate>I build tools that make complex workflows feel simple.</Lead>

      <div className="text-[15px] leading-[1.9]">
        <p className="mt-0 mb-[20px] motion-ready:motion-safe:animate-rise-in motion-ready:motion-safe:[animation-delay:.29s]">I'm <strong className="font-bold text-heading">luqueee</strong>. I build developer tools, from making remote development feel local to helping coding agents understand a codebase. I like taking the friction out of things I use every day.</p>
        <p className="mt-0 mb-[20px] motion-ready:motion-safe:animate-rise-in motion-ready:motion-safe:[animation-delay:.38s]">I work across the stack with <TechnologyLabel name="React" inline />, <TechnologyLabel name="TypeScript" inline /> and <TechnologyLabel name="Go" inline />. Simple interfaces, useful software, and the details that make both feel right.</p>
        <p className="mt-0 mb-[20px] motion-ready:motion-safe:animate-rise-in motion-ready:motion-safe:[animation-delay:.47s]">Take a look at my <Link to="/projects" viewTransition className="font-semibold whitespace-nowrap text-heading underline decoration-[#b4bfb1] underline-offset-[4px] hover:text-accent">projects page <ArrowUpRight size={14} className="inline align-[-2px]" /></Link> or find me through the links below.</p>
      </div>
      <KenabotFeature />
      <NowPlaying />

      <Section index="01" title="Featured projects" id="featured-title">
        <ProjectList featured />
      </Section>

      <Section index="02" title="Experience" id="experience-title">
        <div className="mt-[26px] ml-[45px] max-[641px]:ml-0">
          {experience.map((company) => (
            <ExternalLink key={company.name} href={company.href} className="group/company block border-b border-line py-[17px] text-[14px] transition-[padding] duration-200 ease-[ease] first:border-t hover:pl-[7px] motion-reduce:transition-none">
              <span className="inline-flex items-center gap-[5px] font-bold text-heading">{company.name} <ArrowUpRight size={15} className="text-muted group-hover/company:text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/company:translate-x-px motion-safe:group-hover/company:-translate-y-px motion-safe:group-focus-visible/company:translate-x-px motion-safe:group-focus-visible/company:-translate-y-px" /></span>
            </ExternalLink>
          ))}
        </div>
      </Section>

      <Section index="03" title="Everyday tools" id="stack-title">
        <p className={sectionDescriptionClasses}>A small selection of the technologies I build with.</p>
        <div aria-label="Technologies" className="ml-[45px] flex flex-wrap gap-[9px] max-[641px]:ml-0">
          {everydayTechnologies.map((technology) => <TechnologyLabel name={technology} key={technology} />)}
        </div>
      </Section>

      <Section index="04" title="Get in touch" id="connect-title" className="mb-[120px] max-[641px]:mb-[85px]">
        <p className={sectionDescriptionClasses}>Have an idea in mind or just want to say hello? Drop me a line.</p>
        <a href={socialLinks.email.href} className="group/email ml-[45px] inline-flex items-center gap-[10px] border-b border-heading pb-[4px] font-heading text-[clamp(18px,4vw,25px)] font-bold tracking-[-.035em] text-heading hover:border-accent hover:text-accent motion-safe:transition-[color,translate,scale] motion-safe:duration-[200ms,250ms,120ms] motion-safe:ease-[ease,var(--ease-editorial),ease] motion-safe:active:scale-[.97] max-[641px]:ml-0">
          {email} <ArrowUpRight size={19} strokeWidth={1.7} className="text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/email:translate-x-px motion-safe:group-hover/email:-translate-y-px motion-safe:group-focus-visible/email:translate-x-px motion-safe:group-focus-visible/email:-translate-y-px" />
        </a>
        <div className="mt-[32px] ml-[45px] flex flex-wrap gap-[24px] max-[641px]:ml-0">
          {contacts.map((contact) => {
            const Icon = socialIcons[contact.icon]
            const ContactLink = contact.external ? ExternalLink : 'a'
            return (
              <ContactLink key={contact.label} href={contact.href} className={socialLinkClasses}>
                <Icon size={16} /> {contact.label} <ArrowUpRight size={13} className="text-muted" />
              </ContactLink>
            )
          })}
        </div>
      </Section>
    </PageContent>
  )
}
