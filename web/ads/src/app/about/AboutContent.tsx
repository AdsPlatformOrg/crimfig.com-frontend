'use client';

import Image from 'next/image';
import { MarketingReveal } from '../../components/landing/MarketingReveal';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import translations from './about-messages.json';

const sections: Array<{
  id: keyof typeof translations;
  heading: string;
  subtitle: string;
  image: string;
  alt: string;
  detail?: string;
}> = [
  {
    id: 'who-we-are',
    heading: 'Who We Are',
    subtitle: 'We build tools that connect advertisers, promoters, and creators.',
    image: 'about-team.webp',
    alt: 'Colleagues discussing a project around a table',
    detail: 'CrimFig builds tools for advertisers, website publishers, and creators. We bring campaign management and promotion together so businesses can reach people through the websites and creators they follow.',
  },
  {
    id: 'what-we-do',
    heading: 'What We Do',
    subtitle: 'We connect campaigns with places to run them.',
    image: 'about-marketing.webp',
    alt: 'A woman working on social media on a laptop',
    detail: 'Advertisers create campaigns with their own creative, targeting, and budget. Promoters can set up ad placements on verified websites or share tracked links with their audiences. CrimFig Ads brings delivery and performance reporting into the same workspace.',
  },
  {
    id: 'better-connections',
    heading: 'Better connections.',
    subtitle: 'CrimFig Ads gives businesses a place to build campaigns and publishers a place to manage placements. CrimFig Billing brings funding, escrow, and transaction history together.',
    image: 'about-connections.webp',
    alt: 'Two colleagues collaborating at a laptop',
  },
  {
    id: 'advertisers',
    heading: 'Our Value for Advertisers',
    subtitle: 'Control your budget and see how your campaign performs.',
    image: 'about-advertisers.webp',
    alt: 'A woman reviewing data on a laptop and taking notes',
    detail: 'Use Advertiser Studio to build campaigns, set targeting and budgets, and submit creative for review. Once a campaign is running, you can follow delivery and spend. CrimFig Billing brings wallet funding, campaign escrow, and transaction history together.',
  },
  {
    id: 'promoters',
    heading: 'Our Value for Promoters',
    subtitle: 'Put your website or audience to work.',
    image: 'about-promoters.webp',
    alt: 'A creator setting up a smartphone on a ring-light tripod',
    detail: 'Website publishers can verify their sites and manage placements in Promoter Hub. Creators and other promoters can share tracked links and see attributed activity. The workspace brings performance and earnings information together, so you can see what your placements or links are doing.',
  },
];

export function AboutContent() {
  const { locale } = useLanguage();
  return (
      <MarketingReveal className="cf-ads-about">
        {sections.map(({ id, heading, subtitle, image, alt, detail }, index) => {
          const translated = locale === 'fr' || locale === 'es'
            ? translations[id][locale]
            : { heading, subtitle, alt, detail };
          const Heading = index === 0 ? 'h1' : 'h2';
          return (
            <section key={id} id={id} aria-labelledby={id + '-heading'} className="cf-marketing-section" data-ads-reveal={index === 0 ? undefined : true}>
              <div className="cf-marketing-copy">
                <Heading id={id + '-heading'}>{translated.heading}</Heading>
                <p>{translated.subtitle}</p>
              </div>
              <div className="cf-marketing-visual">
                <Image src={'/img/marketing/' + image} alt={translated.alt} fill sizes="100vw" priority={index === 0} />
              </div>
              {translated.detail && <p className="cf-ads-about-detail">{translated.detail}</p>}
            </section>
          );
        })}
      </MarketingReveal>
  );
}
