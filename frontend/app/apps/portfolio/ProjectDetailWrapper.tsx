import React from 'react';
import { ProjectDetail } from './components/ProjectDetails/ProjectDetail';

import LaVideo from '../../assets/videos/LaVideo.mp4'
import Lalogo from '../../assets/img/portfolio/LaLogo.png'
import LoomsFullPage from '../../assets/img/portfolio/LoomsFullPage.jpeg'
import LoomsMen from '../../assets/img/portfolio/LoomsMen.png'
import LoomsWomen from '../../assets/img/portfolio/LoomsWomen.png'
import LoomsShop from '../../assets/img/portfolio/LoomsWomen.png'
import LoomsBestSeller from '../../assets/img/portfolio/LoomsBestSeller.png'
import LoomsImg from '../../assets/img/portfolio/LoomsImg1.png'
import AgrotechImg from '../../assets/img/portfolio/Agrotech.png'
//Etmae Assests
import EtmaeImg from '../../assets/img/portfolio/EtmaeImgHero.png'
import EtmaeImgDesktop from '../../assets/img/portfolio/EtmaeImgDesktop.png'
import EtmaeImgAI from '../../assets/img/portfolio/EtmaeImgAI.png'
import EtmaeImgHero from '../../assets/img/portfolio/EtmaeImgHero.png'
import EtmaeImgHeroLight from '../../assets/img/portfolio/EtmaeImgHeroLight.png'
import EtmaeLogo from '../../assets/img/portfolio/EtmaeLogo.png'

//Fudco Assests
import FudcoDashboard from '../../assets/img/portfolio/fudcoDashboard.png'
import FudcoPOS from '../../assets/img/portfolio/fudcoPOS.png'
import FudcoReceipts from '../../assets/img/portfolio/fudcoReceipt.png'
import FudcoCheckout from '../../assets/img/portfolio/fudcoCheckout.png'
import FudcoDashboardMb from '../../assets/img/portfolio/fudcoDashboardMobile.png'

import Chatbox from  '../../assets/img/portfolio/Chatbox.png'


import NA from '../../assets/img/portfolio/NA.png'

export type MediaItem = {
  type: 'image' | 'video';
  src: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  role: string;
  image?: string;
  video?: string;  heroMediaType?: 'video' | 'image';  descriptionTitle: string;
  fullDescription: string;
  overview: string;
  ongoing?: boolean;
};

export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    number: '01',
    title: 'Looms & Aura',
    role: 'Fashion Branding',
    image: LoomsImg,
    video: LaVideo,
    heroMediaType: 'video',
    descriptionTitle: 'Luxury Fashion E-commerce',
    overview: 'A luxury fashion e-commerce platform blending editorial elegance with seamless shopping.',
    fullDescription:
      'A luxury fashion e-commerce platform blending editorial elegance with seamless shopping. Curated collections, video showcases, and an elevated browsing experience designed to transform casual browsing into a curated discovery journey.',
  },
  {
    id: '2',
    number: '02',
    title: 'Fudco',
    role: 'Retail POS System',
    image: FudcoDashboard,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'image',
    descriptionTitle: 'Django Point-of-Sale Platform',
    overview: 'A full-featured retail POS and inventory system with manager/cashier roles, checkout workflow, sales analytics, and restock alerts.',
    fullDescription:
      'Fudco is a Django-powered point-of-sale platform designed for modern retail operations. It includes inventory management, cashier-facing POS checkout, automated low-stock alerts, sales reporting dashboards, receipt generation, and role-based user management. The system supports cash, card, transfer, and mobile money payments while keeping inventory synchronized in real time.',
  },
  {
    id: '3',
    number: '03',
    title: 'Etmae Virtual OS',
    role: 'Full-Stack Integration',
    image: EtmaeImgDesktop,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'video',
    descriptionTitle: 'Personal Portfolio',
    overview:
      'A Windows 11 inspired portfolio experience. A fully immersive OS-like environment with draggable windows, a functional start menu, and interactive applications showcasing work in a familiar desktop metaphor.',
    fullDescription:
      'A Windows 11 inspired portfolio experience. A fully immersive OS-like environment with draggable windows, a functional start menu, and interactive applications showcasing work in a familiar desktop metaphor.',
  },
  {
    id: '4',
    number: '04',
    title: 'SQUADRON',
    role: '3D WebGL',
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
    heroMediaType: 'image',
    descriptionTitle: 'Kinetic Motion',
    overview:
      'A high-performance dogfighting simulation. The technical challenge was maintaining 120fps while rendering complex volumetric clouds and physics-based particle trails. Every UI element was designed to mimic high-altitude telemetry.',
    fullDescription:
      'A high-performance dogfighting simulation. The technical challenge was maintaining 120fps while rendering complex volumetric clouds and physics-based particle trails. Every UI element was designed to mimic high-altitude telemetry.',
    ongoing: true,
  },
  {
    id: '5',
    number: '05',
    title: 'Agrotech',
    role: 'Agricultural Agency Platform',
    image: AgrotechImg,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'image',
    descriptionTitle: 'Innovation in Farming',
    overview: 'Connecting farmers with innovative agrotech solutions.',
    fullDescription:
      'An agricultural agency platform connecting farmers with innovative agrotech solutions. Streamlined access to biotechnology, greenhouse management, and sustainable farming extension services that empower rural communities.',
  },
];


export type ProjectFactoryEntry = {
  tags: [string, string, string, string, string, string];
  media: [MediaItem, MediaItem, MediaItem, MediaItem, MediaItem];
};

export const PROJECT_FACTORY_CONTENT: Record<string, ProjectFactoryEntry> = {
  '1': {
    tags: ['HomePage', 'Men Fashion', 'Logo', 'Women Clothing', 'BestSeller', 'Hero'],
    media: [
      { type: 'image', src: LoomsFullPage },
      { type: 'image', src: LoomsMen },
      { type: 'image', src: Lalogo },
      { type: 'image', src: LoomsShop },
      { type: 'image', src: LoomsBestSeller },
    ],
  },
  '2': {
    tags: ['Dashboard', 'Inventory', 'POS', 'Reports', 'Receipts', 'Checkout'],
    media: [
      { type: 'image', src: FudcoPOS},
      { type: 'image', src:  FudcoDashboard },
      { type: 'image', src: FudcoCheckout},
      { type: 'image', src: FudcoReceipts },
      { type: 'image', src: FudcoPOS },
    ],
  },
  '3': {
    tags: ['Hero', 'LOGO', 'ETMAE AI', 'HERO LIGHT MODE', 'NA', 'DESKTOP VIEW'],
    media: [
      { type: 'image', src: EtmaeImgHero },
      { type: 'image', src: EtmaeLogo },
      { type: 'image', src: Chatbox },
      { type: 'image', src: EtmaeImgHeroLight },
      { type: 'image', src: NA },
    ],
  },
  '4': {
    tags: ['NA', 'NA', 'NA', 'NA', 'NA', 'NA'],
    media: [
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
    ],
  },
  '5': {
    tags: ['NA', 'NA', 'NA', 'NA', 'NA', 'NA'],
    media: [
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
      { type: 'image', src: NA },
    ],
  },
};

const FALLBACK_FACTORY: ProjectFactoryEntry = {
  tags: ['NA', 'NA', 'NA', 'NA', 'NA', 'NA'],
  media: [
    { type: 'image', src: NA },
    { type: 'image', src: NA },
    { type: 'image', src: NA },
    { type: 'image', src: NA },
    { type: 'image', src: NA },
  ],
};

interface ProjectDetailWrapperProps {
  projectId: string;
  theme: 'dark' | 'light';
  onBack: () => void;
}

export const ProjectDetailWrapper: React.FC<ProjectDetailWrapperProps> = ({
  projectId,
  theme,
  onBack,
}) => {
  const project = PROJECTS_DATA.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-50 text-zinc-900'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <button onClick={onBack} className="text-green-500 hover:underline font-mono text-sm">
            Back to Works
          </button>
        </div>
      </div>
    );
  }

  const factory = PROJECT_FACTORY_CONTENT[project.id] ?? FALLBACK_FACTORY;

  return (
    <ProjectDetail
      project={project}
      onBack={onBack}
      theme={theme}
      factory={factory}
    />
  );
};

export default ProjectDetailWrapper;