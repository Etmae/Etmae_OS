import React from 'react';
import { ProjectDetail } from './components/ProjectDetail';
import LoomsImg from '../../assets/img/portfolio/LoomsImg1.png'
import AgrotechImg from '../../assets/img/portfolio/Agrotech.png'
import EtmaeImg from '../../assets/img/portfolio/EtmaeImg.png'
import LoomsFullPage from '../../assets/img/portfolio/LoomsFullPage.jpeg'
import LoomsMen from '../../assets/img/portfolio/LoomsMen.png'
import LoomsWomen from '../../assets/img/portfolio/LoomsWomen.png'
import LoomsShop from '../../assets/img/portfolio/LoomsWomen.png'
import LoomsBestSeller from '../../assets/img/portfolio/LoomsBestSeller.png'


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
  ongoing?: boolean;
};

export const PROJECTS_DATA: Project[] = [
  { 
    id: '1', 
    number: '01', 
    title: 'Looms & Aura', 
    role: 'Fashion Branding', 
    image: LoomsImg,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'video',
    descriptionTitle: "Luxury Fashion E-commerce",
    fullDescription: "A luxury fashion e-commerce platform blending editorial elegance with seamless shopping. Curated collections, video showcases, and an elevated browsing experience designed to transform casual browsing into a curated discovery journey."
  },
  { 
    id: '2', 
    number: '02', 
    title: 'Agrotech', 
    role: 'Agricultural Agency Platform', 
    image: AgrotechImg,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'image',
    descriptionTitle: "Innovation in Farming",
    fullDescription: "An agricultural agency platform connecting farmers with innovative agrotech solutions. Streamlined access to biotechnology, greenhouse management, and sustainable farming extension services that empower rural communities."
  },
  { 
    id: '3', 
    number: '03', 
    title: 'Etmae Virtual OS', 
    role: 'Full-Stack Integration', 
    image: EtmaeImg,
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    heroMediaType: 'video',
    descriptionTitle: "Personal Portfolio",
    fullDescription: "A Windows 11 inspired portfolio experience. A fully immersive OS-like environment with draggable windows, a functional start menu, and interactive applications showcasing work in a familiar desktop metaphor."
  },
  { 
    id: '4', 
    number: '04', 
    title: 'SQUADRON', 
    role: '3D WebGL', 
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
    heroMediaType: 'image',
    descriptionTitle: "Kinetic Motion",
    fullDescription: "A high-performance dogfighting simulation. The technical challenge was maintaining 120fps while rendering complex volumetric clouds and physics-based particle trails. Every UI element was designed to mimic high-altitude telemetry.",
    ongoing: true,
  },
  { 
    id: '5', 
    number: '05', 
    title: 'NEO VISION', 
    role: 'Web Agency Platform', 
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070',
    heroMediaType: 'image',
    descriptionTitle: "New Standards",
    fullDescription: "Neo Vision is a manifesto for the modern agency. We stripped away the standard grid entirely, opting for an 'editorial-fluid' layout that treats every screen like a high-fashion magazine spread with cinematic transitions."
  },
];

export type ProjectFactoryEntry = {
  tags: [string, string, string, string, string];
  media: [MediaItem, MediaItem, MediaItem, MediaItem, MediaItem];
};

export const PROJECT_FACTORY_CONTENT: Record<string, ProjectFactoryEntry> = {
  '1': {
    tags: ['Fashion Grid', 'Collection Module.v1', 'Editorial Flow', 'E-Commerce Logic', 'Final Showcase'],
    media: [
      { type: 'image', src: LoomsFullPage },
      { type: 'image', src: LoomsMen },
      { type: 'image', src: LoomsWomen },
      { type: 'image', src: LoomsShop },
      { type: 'image', src: LoomsBestSeller },
    ],
  },
  '2': {
    tags: ['Farm Systems', 'Agrotech Module.v1', 'Sustainability', 'Extension Logic', 'Final Harvest'],
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=2074' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070' },
    ],
  },
  '3': {
    tags: ['Root Architecture', 'Growth Module.v1', 'Soil Typography', 'Pipeline Logic', 'Final Harvest'],
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964' },
    ],
  },
  '4': {
    tags: ['Flight Systems', 'HUD Module.v1', 'Telemetry', 'Air Combat Logic', 'Final Sortie'],
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=2074' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070' },
    ],
  },
  '5': {
    tags: ['Editorial Grid', 'Layout Module.v1', 'Type Scale', 'Agency Logic', 'Final Edition'],
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2064' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070' },
    ],
  },
};

const FALLBACK_FACTORY: ProjectFactoryEntry = {
  tags: ['Core Architecture', 'Module.v1', 'Typography', 'System Mapping', 'Final Build'],
  media: [
    { type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070' },
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