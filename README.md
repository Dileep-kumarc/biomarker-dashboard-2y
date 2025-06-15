# EcoTown Health Dashboard - Biomarker Time Series Visualization

![EcoTown Health Dashboard](https://img.shields.io/badge/EcoTown-Health%20Dashboard-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)

A comprehensive healthcare dashboard for visualizing biomarker trends over time, designed for healthcare professionals to track patient health metrics and make informed clinical decisions.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Features & Functionality](#features--functionality)
- [Clinical Interpretation Guide](#clinical-interpretation-guide)
- [Usage Instructions](#usage-instructions)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

### Objectives

The EcoTown Health Dashboard is designed to address critical challenges in healthcare data visualization:

1. **Automated Data Extraction**: Eliminate manual data entry by automatically extracting biomarker values from PDF health reports
2. **Time Series Visualization**: Provide clear, interactive charts showing biomarker trends over time
3. **Clinical Decision Support**: Offer real-time clinical interpretations based on established medical guidelines
4. **Risk Assessment**: Identify concerning trends and alert healthcare providers to potential issues
5. **Patient Monitoring**: Enable continuous tracking of key health indicators for better patient outcomes

### Target Users

- **Healthcare Professionals**: Doctors, nurses, and medical practitioners
- **Clinical Researchers**: For analyzing patient data trends
- **Health Administrators**: For population health management
- **Patients**: For personal health tracking (with provider guidance)

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript 5.0** - Type-safe JavaScript development

### Styling & UI Components
- **Tailwind CSS 3.0** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Data Visualization
- **Recharts** - Composable charting library
  - Line charts for time series data
  - Reference lines for clinical ranges
  - Interactive tooltips and legends
  - Responsive design support

### Data Processing
- **FileReader API** - Browser-native file processing
- **Regular Expressions** - Pattern matching for biomarker extraction
- **TypeScript Interfaces** - Type-safe data structures

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Static type checking

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/ecotown/health-dashboard.git
   cd health-dashboard
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open in Browser**
   Navigate to \`http://localhost:3000\`

### Production Deployment

#### Deploy to Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

#### Deploy to Netlify
\`\`\`bash
npm run build
# Upload dist folder to Netlify
\`\`\`

#### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Environment Configuration

Create a \`.env.local\` file for environment variables:
\`\`\`env
NEXT_PUBLIC_APP_NAME=EcoTown Health Dashboard
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
\`\`\`

## ✨ Features & Functionality

### 🔄 PDF Upload & Data Extraction

- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Smart Pattern Recognition**: Automatically detects biomarker values using advanced regex patterns
- **Multi-format Support**: Handles various health report formats and layouts
- **Real-time Processing**: Live progress indicators during extraction
- **Error Handling**: Comprehensive validation and user-friendly error messages

**Supported Biomarkers:**
- Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)
- Kidney Function (Creatinine)
- Vitamins (Vitamin D, Vitamin B12)
- Diabetes Marker (HbA1c)

### 📊 Interactive Time Series Visualization

- **Multi-biomarker Charts**: Switch between different biomarkers seamlessly
- **Clinical Reference Lines**: Visual indicators for optimal, borderline, and high-risk ranges
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Zoom & Pan**: Detailed analysis of specific time periods

### 🏥 Clinical Decision Support

- **Risk Level Assessment**: Automatic categorization (Optimal, Borderline, High Risk)
- **Trend Analysis**: Visual indicators for improving, stable, or declining trends
- **Clinical Alerts**: Immediate notifications for concerning values
- **Interpretation Guidelines**: Evidence-based recommendations for each biomarker

### 📈 Dashboard Analytics

- **Biomarker Cards**: Quick overview of latest values with trend indicators
- **Percentage Changes**: Quantified improvements or declines
- **Data Summary**: Comprehensive statistics for each measurement period
- **Export Functionality**: Save charts and reports for external use

## 🩺 Clinical Interpretation Guide

### Lipid Profile

#### Total Cholesterol
- **Optimal**: < 200 mg/dL - Continue healthy lifestyle
- **Borderline**: 200-239 mg/dL - Consider dietary modifications
- **High Risk**: ≥ 240 mg/dL - Requires medical intervention

#### HDL Cholesterol (Good Cholesterol)
- **Optimal**: 40-60 mg/dL - Protective against heart disease
- **Low**: < 40 mg/dL - Major cardiovascular risk factor
- **High**: > 60 mg/dL - Additional protection

#### LDL Cholesterol (Bad Cholesterol)
- **Optimal**: < 100 mg/dL - Low cardiovascular risk
- **Near Optimal**: 100-129 mg/dL - Monitor closely
- **Borderline High**: 130-159 mg/dL - Lifestyle changes recommended
- **High**: 160-189 mg/dL - May require medication
- **Very High**: ≥ 190 mg/dL - Immediate medical attention

#### Triglycerides
- **Normal**: < 150 mg/dL - Continue current lifestyle
- **Borderline High**: 150-199 mg/dL - Reduce refined carbohydrates
- **High**: 200-499 mg/dL - Significant cardiovascular risk
- **Very High**: ≥ 500 mg/dL - Risk of pancreatitis

### Kidney Function

#### Creatinine
- **Normal**: 0.7-1.18 mg/dL - Healthy kidney function
- **Elevated**: > 1.18 mg/dL - May indicate kidney dysfunction
- **Significantly High**: > 2.0 mg/dL - Requires immediate evaluation

### Vitamins

#### Vitamin D (25-OH)
- **Sufficient**: 30-100 ng/mL - Optimal bone health
- **Insufficient**: 20-29 ng/mL - Consider supplementation
- **Deficient**: < 20 ng/mL - Requires immediate supplementation
- **Toxic**: > 100 ng/mL - Discontinue supplementation

#### Vitamin B12
- **Normal**: 211-911 pg/mL - Adequate neurological function
- **Low Normal**: 150-210 pg/mL - Monitor closely
- **Deficient**: < 150 pg/mL - Risk of anemia and neuropathy

### Diabetes Management

#### HbA1c (Glycated Hemoglobin)
- **Normal**: 4.0-5.6% - No diabetes
- **Prediabetes**: 5.7-6.4% - High risk, lifestyle intervention needed
- **Diabetes**: ≥ 6.5% - Requires medical management
- **Good Control**: < 7% - For diagnosed diabetics
- **Poor Control**: > 8% - Immediate intervention required

### Clinical Action Guidelines

#### Immediate Attention Required
- HbA1c ≥ 6.5% (new diagnosis)
- Creatinine > 2.0 mg/dL
- Vitamin D < 10 ng/mL
- Total Cholesterol > 300 mg/dL

#### Monitor Closely
- Borderline values in any category
- Declining trends over multiple measurements
- New medications affecting biomarkers

#### Lifestyle Interventions
- Diet modification for lipid management
- Exercise recommendations
- Vitamin supplementation protocols
- Weight management strategies

## 📖 Usage Instructions

### Getting Started

1. **Access Dashboard**: Open the application in your web browser
2. **Review Sample Data**: Explore the pre-loaded patient data
3. **Upload New Report**: Click "Upload New Report" to add data

### Uploading Health Reports

1. **Prepare PDF**: Ensure your health report is in PDF format
2. **Upload File**: Drag and drop or click to select file
3. **Monitor Progress**: Watch the extraction process
4. **Review Results**: Verify extracted biomarkers
5. **View Updated Charts**: See new data points in visualizations

### Interpreting Visualizations

1. **Select Biomarker**: Use tabs to switch between different markers
2. **Analyze Trends**: Look for patterns over time
3. **Check Reference Lines**: Compare values to clinical ranges
4. **Review Alerts**: Pay attention to risk level indicators
5. **Export Data**: Save charts for reports or consultations

### Best Practices

- **Regular Updates**: Upload reports consistently for accurate trends
- **Data Validation**: Always verify extracted values for accuracy
- **Clinical Correlation**: Use dashboard insights alongside clinical judgment
- **Patient Communication**: Share visualizations to improve patient understanding

## 🔮 Future Enhancements

### Short-term Improvements (Next 3 months)

#### Enhanced PDF Processing
- **Real PDF.js Integration**: Replace simulation with actual PDF parsing
- **OCR Capability**: Extract data from scanned documents
- **Multi-language Support**: Handle reports in different languages
- **Batch Processing**: Upload multiple files simultaneously

#### Advanced Visualizations
- **Correlation Analysis**: Show relationships between biomarkers
- **Predictive Modeling**: Forecast future trends
- **Comparative Views**: Compare multiple patients or time periods
- **3D Visualizations**: Enhanced data representation

#### User Experience
- **Dark Mode**: Alternative color scheme
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile App**: Native iOS/Android applications
- **Offline Mode**: Work without internet connection

### Medium-term Goals (6-12 months)

#### Clinical Integration
- **EHR Integration**: Connect with Electronic Health Records
- **HL7 FHIR Support**: Healthcare data interoperability
- **Clinical Decision Rules**: Automated recommendations
- **Alert System**: Real-time notifications for critical values

#### Advanced Analytics
- **Machine Learning**: Pattern recognition and anomaly detection
- **Population Health**: Aggregate analytics across patients
- **Risk Scoring**: Comprehensive health risk assessment
- **Outcome Prediction**: Forecast health outcomes

#### Collaboration Features
- **Multi-user Support**: Team-based healthcare management
- **Secure Sharing**: HIPAA-compliant data sharing
- **Annotation System**: Add notes and observations
- **Audit Trail**: Complete activity logging

### Long-term Vision (1-2 years)

#### AI-Powered Insights
- **Natural Language Processing**: Extract insights from clinical notes
- **Computer Vision**: Analyze medical images
- **Personalized Medicine**: Tailored treatment recommendations
- **Drug Interaction Checking**: Medication safety analysis

#### Platform Expansion
- **Telemedicine Integration**: Remote patient monitoring
- **Wearable Device Support**: Real-time biomarker tracking
- **Genomic Data**: Incorporate genetic information
- **Social Determinants**: Include lifestyle and environmental factors

#### Research Capabilities
- **Clinical Trial Support**: Patient recruitment and monitoring
- **Research Database**: Anonymized data for studies
- **Publication Tools**: Generate research reports
- **Regulatory Compliance**: FDA/CE marking support

## 🤝 Contributing

We welcome contributions from the healthcare and developer communities!

### Development Setup

1. **Fork Repository**: Create your own copy
2. **Create Branch**: \`git checkout -b feature/your-feature\`
3. **Make Changes**: Implement your improvements
4. **Test Thoroughly**: Ensure all functionality works
5. **Submit PR**: Create a pull request with detailed description

### Contribution Guidelines

- **Code Quality**: Follow TypeScript and React best practices
- **Testing**: Include unit tests for new features
- **Documentation**: Update README and inline comments
- **Clinical Accuracy**: Verify medical information with healthcare professionals

### Areas for Contribution

- **Bug Fixes**: Resolve issues and improve stability
- **Feature Development**: Add new functionality
- **Documentation**: Improve guides and tutorials
- **Testing**: Expand test coverage
- **Accessibility**: Enhance usability for all users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Commercial Use

For commercial deployment in healthcare settings, please contact:
- **Email**: licensing@ecotown.health
- **Website**: https://ecotown.health/licensing

## 🆘 Support & Contact

### Technical Support
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and tutorials
- **Community Forum**: Connect with other users

### Clinical Support
- **Medical Advisory Board**: Clinical guidance and validation
- **Healthcare Partnerships**: Integration with healthcare systems
- **Training Programs**: Educational resources for healthcare professionals

### Contact Information
- **General Inquiries**: info@ecotown.health
- **Technical Support**: support@ecotown.health
- **Clinical Questions**: clinical@ecotown.health
- **Partnership Opportunities**: partnerships@ecotown.health

---

**Disclaimer**: This dashboard is designed to assist healthcare professionals in data visualization and analysis. It is not intended to replace clinical judgment or provide medical advice. Always consult with qualified healthcare providers for medical decisions.

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: EcoTown Health Tech Team
