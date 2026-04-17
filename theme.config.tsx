import React from 'react'
import { useRouter } from 'next/router'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'
import Image from 'next/image';
import discordLogo from './public/discord-logo.svg';
import LogoComponent from "./components/logo";

const config: DocsThemeConfig = {
  docsRepositoryBase: 'https://github.com/featbit/featbit-docs/tree/main',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – FeatBit'
      }
    }
  },
  logo: () => (
    <>
      <LogoComponent />
      <h1 style={{ marginLeft: '12px', fontWeight: 800, fontSize: '24px',  lineHeight: '33px'}}>
        FeatBit Docs
      </h1>
    </>
  ),
  head: function Head() {
    const { title } = useConfig()
    const socialCard = 'https://www.featbit.co/og.png'

    return (
        <>
            <meta name="msapplication-TileColor" content="#fff" />
            <meta name="theme-color" content="#fff" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Language" content="en" />
            <meta
                name="description"
                content="Open Source Feature Flags Management Service, Friendly for Self Hosted, Azure, AWS, GCP"
            />
            <meta
                name="og:description"
                content="Open Source Feature Flags Management Service, Friendly for Self Hosted, Azure, AWS, GCP"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={socialCard} />
            <meta name="twitter:site:domain" content="featbit.co" />
            <meta name="twitter:url" content="https://featbit.co" />
            <meta
                name="og:title"
                content={title ? title + ' – FeatBit' : 'FeatBit'}
            />
            <meta name="og:image" content={socialCard} />
            <meta name="apple-mobile-web-app-title" content="Nextra" />
            <link rel="icon" href="/icon.svg" type="image/svg+xml" />
            <link rel="icon" href="/logo.png" type="image/png" />
            <link
                rel="icon"
                href="/icon.svg"
                type="image/svg+xml"
                media="(prefers-color-scheme: dark)"
            />
            <link
                rel="icon"
                href="/local.png"
                type="image/png"
                media="(prefers-color-scheme: dark)"
            />
        </>
    );
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  project: {
    link: 'https://github.com/featbit/featbit',
  },
  chat: {
    icon:  <Image priority src={discordLogo} width={24} alt="FeatBit Discord" height={24} />,
    link: 'https://discord.gg/ytK9xGJSw3',
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  footer: {
    text: `© ${new Date().getFullYear()} FeatBit`,
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: "system",
  },
}

export default config
