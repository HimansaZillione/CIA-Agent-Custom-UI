// Bot sends channelData: { sidebarAction:'SHOW_PRODUCT', payload:{ tag:'dashboard' } }
// The tag is looked up here to render the correct content in the context panel.
// Replace imageFallback URLs with your own hosted images, or add local paths to src/assets/products/

const products = {
  dashboard: {
    label: 'Analytics Dashboard',
    tagline: 'Real-time business intelligence',
    image: '/src/assets/products/dashboard.png',
    imageFallback: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    description: 'Unified KPIs, revenue trends and operational metrics updated in real time with Power BI embedded reporting.',
    specs: ['Multi-tenant architecture','Power BI embedded','Role-based access control','Mobile responsive','Custom alert thresholds'],
    cta: 'Request a demo',
    ctaMsg: 'I would like a demo of the Analytics Dashboard',
  },
  jabra: {
    label: 'Jabra Device Fleet',
    tagline: 'Enterprise audio for hybrid teams',
    image: '/src/assets/products/jabra.png',
    imageFallback: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    description: 'Certified Jabra headsets and speakerphones managed centrally through Jabra Direct. Noise-cancelling, Teams-certified.',
    specs: ['Jabra Direct central management','Active noise cancellation','Microsoft Teams certified','Warranty & swap programme','Bulk licensing'],
    cta: 'Get a quote',
    ctaMsg: 'I would like a quote for Jabra devices',
  },
  cloud: {
    label: 'Cloud Infrastructure',
    tagline: 'Azure-native, built to scale',
    image: '/src/assets/products/cloud.png',
    imageFallback: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    description: 'End-to-end Azure infrastructure design, deployment and managed operations including IaC, monitoring and cost optimisation.',
    specs: ['Azure Landing Zone setup','Bicep / Terraform IaC','Microsoft Defender for Cloud','24/7 SOC monitoring','Monthly cost reports'],
    cta: 'Talk to an architect',
    ctaMsg: 'I would like to speak with a cloud architect',
  },
  cybersecurity: {
    label: 'Cybersecurity Services',
    tagline: 'Protect, detect and respond',
    image: '/src/assets/products/cybersecurity.png',
    imageFallback: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    description: 'Comprehensive security covering vulnerability assessments, SIEM/SOAR, endpoint protection and incident response aligned to ISO 27001.',
    specs: ['Pen testing & vulnerability assessment','Microsoft Sentinel SIEM','EDR endpoint protection','Security awareness training','IR retainer'],
    cta: 'Book an assessment',
    ctaMsg: 'I would like to book a cybersecurity assessment',
  },
}

export default products
