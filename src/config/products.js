import jabraImg       from '../assets/products/jabra.png'
import cloudImg       from '../assets/products/cloud.png'
import cybersecImg    from '../assets/products/cybersecurity.png'
import dashboardImg   from '../assets/products/dashboard.png'
import dynamicsImg    from '../assets/products/dynamics.png'
import insightBotImg  from '../assets/products/insight-bot.png'
import sageImg        from '../assets/products/sage.png'
import softwareImg    from '../assets/products/software.png'
import teamsImg       from '../assets/products/teams.png'

const products = {
  jabra: {
    keywords: [],
    label: 'Jabra Device Fleet',
    tagline: 'Enterprise audio for hybrid teams',
    image: jabraImg,
    imageFallback: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    description: 'Certified Jabra headsets and speakerphones managed centrally through Jabra Direct. Noise-cancelling, Teams-certified.',
    specs: ['Jabra Direct central management','Active noise cancellation','Microsoft Teams certified','Warranty & swap programme','Bulk licensing'],
    cta: 'Get a quote',
    ctaMsg: 'I would like a quote for Jabra devices',
  },
  cloud: {
    keywords: [],
    label: 'Cloud Infrastructure',
    tagline: 'Azure-native, built to scale',
    image: cloudImg,
    imageFallback: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    description: 'End-to-end Azure infrastructure design, deployment and managed operations including IaC, monitoring and cost optimisation.',
    specs: ['Azure Landing Zone setup','Bicep / Terraform IaC','Microsoft Defender for Cloud','24/7 SOC monitoring','Monthly cost reports'],
    cta: 'Talk to an architect',
    ctaMsg: 'I would like to speak with a cloud architect',
  },
  cybersecurity: {
    keywords: [],
    label: 'Cybersecurity Services',
    tagline: 'Protect, detect and respond',
    image: cybersecImg,
    imageFallback: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    description: 'Comprehensive security covering vulnerability assessments, SIEM/SOAR, endpoint protection and incident response aligned to ISO 27001.',
    specs: ['Pen testing & vulnerability assessment','Microsoft Sentinel SIEM','EDR endpoint protection','Security awareness training','IR retainer'],
    cta: 'Book an assessment',
    ctaMsg: 'I would like to book a cybersecurity assessment',
  },
  dashboard: {
    keywords: [],
    label: 'Analytics Dashboard',
    tagline: 'Real-time business intelligence',
    image: dashboardImg,
    imageFallback: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    description: 'Unified KPIs, revenue trends and operational metrics updated in real time with Power BI embedded reporting.',
    specs: ['Multi-tenant architecture','Power BI embedded','Role-based access control','Mobile responsive','Custom alert thresholds'],
    cta: 'Request a demo',
    ctaMsg: 'I would like a demo of the Analytics Dashboard',
  },
  dynamics: {
    keywords: [],
    label: 'Microsoft Dynamics 365',
    tagline: 'Intelligent business management',
    image: dynamicsImg,
    imageFallback: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    description: 'Dynamics 365 Business Central unifies finance, sales, inventory and HR into one intelligent platform with built-in Copilot AI.',
    specs: ['Business Central ERP','Copilot for Business Central','Dynamics 365 Sales CRM','Power Platform integration','Microsoft 365 native'],
    cta: 'Book a demo',
    ctaMsg: 'I would like a demo of Microsoft Dynamics 365',
  },
  sage: {
    keywords: [],
    label: 'SAGE 300 ERP',
    tagline: 'Multi-entity ERP for growing businesses',
    image: sageImg,
    imageFallback: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    description: 'SAGE 300 ERP delivers unified financial, inventory and operational management with multi-currency and multi-company support.',
    specs: ['SAGE 300 ERP & Cloud','Norming Asset Manager','Multi-currency & multi-entity','SAGE 300 Email Alerts','Custom SAGE integrations'],
    cta: 'Talk to a SAGE expert',
    ctaMsg: 'I would like to speak to a SAGE 300 expert',
  },
  productivity: {
    keywords: [],
    label: 'Productivity & Collaboration',
    tagline: 'Microsoft 365 for the modern workplace',
    image: teamsImg,
    imageFallback: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    description: 'Microsoft 365 modern work solutions including Teams, SharePoint, OneDrive and Copilot for M365 to boost productivity.',
    specs: ['Microsoft 365 Modern Work','Copilot for Microsoft 365','Teams & SharePoint','Copilot for Security','Intune device management'],
    cta: 'Get started with M365',
    ctaMsg: 'I would like to know more about Microsoft 365 solutions',
  },
  software: {
    keywords: [],
    label: 'Software Development',
    tagline: 'Custom software built for your business',
    image: softwareImg,
    imageFallback: 'https://images.unsplash.com/photo-1555066931-4365d14431b4?w=600&q=80',
    description: 'Bespoke enterprise software including OneHub, ZPoS, IBS, Zync and DealerHub — built to fill market gaps and integrate seamlessly.',
    specs: ['OneHub financial platform','ZPoS point of sale','IBS insurance system','Zync integration middleware','PharmaLink & DealerHub'],
    cta: 'Discuss your project',
    ctaMsg: 'I would like to discuss a custom software development project',
  },
  ai: {
    keywords: [],
    label: 'AI Capabilities',
    tagline: 'Intelligent automation for your business',
    image: insightBotImg,
    imageFallback: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    description: 'ZILLIONe AI solutions including Insight Bot, Budee HR Bot, Pixie IT Bot and custom conversational AI agents built on Copilot Studio.',
    specs: ['Insight Bot analytics','Budee HR onboarding bot','Pixie IT support bot','Custom AI agents','Document intelligence'],
    cta: 'Explore AI solutions',
    ctaMsg: 'I would like to learn more about ZILLIONe AI capabilities',
  },
  location: {
    keywords: [],
    label: 'Our Office',
    tagline: 'Come visit us in Colombo',
    description: "2 Mary's Road, Galle Road, Colombo 04, Sri Lanka",
    image: null,
    imageFallback: null,
    specs: [],
    cta: 'Get Directions',
    ctaMsg: 'I would like directions to your office',
  },
}

export default products