import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';
import { AboutFooter, AboutNavigation } from './AboutNavigation';

const aboutMetadata = {
  en: {
    title: 'About CrimFig',
    description: 'Who we are, what we do, and how CrimFig Ads serves advertisers and promoters.',
  },
  fr: {
    title: 'À propos de CrimFig',
    description: 'Découvrez notre équipe, notre activité et les outils que CrimFig Ads propose aux annonceurs et aux promoteurs.',
  },
  es: {
    title: 'Acerca de CrimFig',
    description: 'Conoce quiénes somos, qué hacemos y cómo CrimFig Ads ayuda a anunciantes y promotores.',
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  return aboutMetadata[lang === 'fr' || lang === 'es' ? lang : 'en'];
}

export default function AboutPage() {
  return (
    <div className="cf-marketing">
      <AboutNavigation />
      <AboutContent />
      <AboutFooter />
    </div>
  );
}
