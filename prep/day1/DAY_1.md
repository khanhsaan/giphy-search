# Day 1 – Understand Devika & Baseline (Context First)

**Date:** January 11, 2026  
**Goal:** Speak confidently about their stack and workflow

---

## 🎯 Today's Objectives

1. Research Devika as a company
2. Understand what Baseline IS (it's open-source!) and how it works
3. Prepare talking points about serverless architecture
4. Connect your existing experience to their stack

---

## 📋 Tasks

### 1. Research Devika (30-45 minutes)

#### Company Profile
- [ ] Visit their website and read About/Services pages
- [ ] Check their LinkedIn company page for:
  - Company size and growth
  - Recent posts about projects or culture
  - Employee testimonials
- [ ] Look for case studies or client work
- [ ] Note their tech stack mentions (React, Baseline, etc.)

#### What to learn:
- **What they build:** Type of clients, industries, scale of projects
- **Their culture:** Consulting mindset, fast delivery, ownership expectations
- **Their values:** Innovation, quality, collaboration style
- **Recent news:** New partnerships, projects, or company updates

#### Questions to answer:
- What problems do they solve for their clients?
- What makes them different from other consultancies?
- What kind of developers thrive there?

---

### 2. Understand Baseline (45-60 minutes)

#### What is Baseline?
**Baseline is an open-source fullstack serverless-first framework** for building cloud-native applications. It's NOT an internal tool - it's a complete framework available on GitHub!

**Official Description:**
> "Baseline Core is an open-source fullstack serverless first framework designed to make building cloud native applications easier."

**Key Facts:**
- 🌟 **Open Source** on GitHub: [Baseline-JS/core](https://github.com/Baseline-JS/core)
- 📚 **Public Documentation:** https://docs.baselinejs.com/
- 🏗️ **Full Framework** - Not just deployment, but complete app scaffolding
- ☁️ **Your AWS Account** - Deploys to your own AWS (not shared infrastructure)

**Likely Purpose:**
- Fullstack serverless framework for building production applications
- Simplifies deployment of web apps without manual AWS configuration
- Reduces friction between development and production
- Standardizes deployment patterns across teams

**Architecture & Components:**
```
Baseline Project (Monorepo with pnpm)
        ├── 🚀 API (NodeJS + Express)
        ├── 🖥️ React Admin Website (React + Vite)
        ├── 🌐 React User Website (React + Vite)
        ├── 🔒 Authentication (AWS Cognito)
        ├── 🗄️ Database (DynamoDB)
        └── ⚙️ CI/CD (Bitbucket/GitHub)
                ↓
        Serverless Framework
                ↓
    ┌─────────────┬──────────────┬────────────┬──────────┐
    │             │              │            │          │
AWS Lambda   API Gateway   CloudFront   S3      Cognito
(Backend)     (Routing)    (CDN)       (Static) (Auth)
```

**Major Components:**
- 🚀 **API** - NodeJS + Express backend deployed as Lambda functions
- 🖥️ **React Admin Website** - Built with React + Vite for managing the application
- 🌐 **React User Website** - Public-facing React + Vite frontend
- ⚙️ **CI/CD** - Bitbucket and GitHub Actions support
- 🔧 **Developer Tooling** - Local development, multiple environments
- 🔒 **Authentication** - AWS Cognito integration out-of-the-box
- 🔄 **Multiple Environments** - Staging and production
- 💻 **Run Locally** - Full local development support
- 🏗️ **Infrastructure as Code (IaC)** - Serverless Framework + CloudFormation
- 📦 **Managed Environment Variables** - AWS Systems Manager

**Technology Stack:**
- 🎁 Package Management: **Pnpm** + Monorepo
- 🔨 Language & Build: **TypeScript + ESBuild**
- 🖼 Frontend: **React + Vite**
- ⚙️ Backend: **NodeJS + Express**
- 🎨 Linting & Formatting: **Prettier + Eslint**
- 🏗 IaC: **AWS + Serverless Framework**
- 🚀 Deploy: **Local/Bitbucket/GitHub CI/CD**

**AWS Services Used:**
Cognito, S3, Lambda, DynamoDB, CloudFormation, Route53, Systems Manager, CloudFront, API Gateway, CloudWatch, SNS

#### Your Explanation of Baseline

**Short version (30 seconds):**
> "Baseline is an open-source fullstack serverless framework that provides everything needed to build cloud-native applications. It includes React frontends (admin and user sites), a Node.js Express API backend, authentication via AWS Cognito, DynamoDB for data, and uses Serverless Framework under the hood. It's organized as a monorepo with pnpm and deploys to your own AWS account with built-in CI/CD support."

**Detailed version (2 minutes):**
> "Baseline is a comprehensive open-source framework for building serverless applications on AWS. Unlike deployment tools like Vercel or Netlify, Baseline provides a complete application structure:
> 
> **What You Get:**
> - 🚀 **API** - NodeJS + Express backend deployed as Lambda functions
> - 🖥️ **React Admin Website** - Built with React + Vite for managing the application
> - 🌐 **React User Website** - Public-facing React + Vite frontend
> - 🔒 **Authentication** - AWS Cognito integration out-of-the-box
> - 🗄️ **Database** - DynamoDB for serverless data storage
> - ⚙️ **CI/CD** - Bitbucket and GitHub Actions support built-in
> 
> **Technology Stack:**
> - Package Management: **pnpm** (monorepo structure)
> - Language & Build: **TypeScript + ESBuild**
> - Frontend: **React + Vite**
> - Backend: **NodeJS + Express**
> - IaC: **Serverless Framework** (wraps AWS CloudFormation)
> - Multiple environments (staging/production) and local development
> 
> **AWS Services Used:**
> - Cognito, S3, Lambda, DynamoDB, CloudFormation, Route53, CloudFront, API Gateway, CloudWatch, SNS, Systems Manager
> 
> **Quick Start:**
> ```bash
> npx @baselinejs/quickstart
> ```
> This single command installs requirements, creates the project, sets up AWS credentials, deploys to staging, creates an admin user, and outputs project URLs.
> 
> **Key Benefits:**
> - Everything deploys to YOUR AWS account (full control)
> - Open source (can inspect and modify)
> - Cost-effective (pay only for what you use)
> - Scales automatically
> - Runs locally for development
> - Production-ready with best practices built-in"

---

### 3. Prepare Interview Answers (30 minutes)

#### Q: "What do you know about Baseline?"

**Your Answer:**
"Baseline is an open-source fullstack serverless framework that I've researched in preparation for this interview. Here's what stands out to me:

**What It Is:**
- A complete framework for building cloud-native applications on AWS
- Not just deployment tooling - it provides the entire application structure including React frontends (admin and user sites), a Node.js Express API, authentication, and database setup

**Architecture:**
- Uses a **monorepo structure** with pnpm for package management
- Built with **TypeScript**, **React + Vite** for frontends, **Node.js + Express** for backend
- Leverages **Serverless Framework** under the hood to deploy to AWS services like Lambda, API Gateway, CloudFront, S3, Cognito, and DynamoDB
- Everything deploys to your own AWS account, giving full control

**Developer Experience:**
- Quick start with `npx @baselinejs/quickstart` - one command sets up everything
- Supports multiple environments (staging/production)
- Can run locally for development
- Built-in CI/CD for Bitbucket and GitHub
- Includes authentication out-of-the-box with AWS Cognito

**Why It's Powerful:**
- Eliminates the boilerplate of setting up serverless infrastructure
- Enforces best practices and consistent patterns
- Cost-effective since it's serverless (pay per use)
- Scales automatically
- Open source, so I can learn from and contribute to it

I'm excited to work with Baseline because it combines technologies I already know (React, Node.js, TypeScript) with serverless architecture patterns I've used in my projects. The monorepo structure and infrastructure-as-code approach align with modern development practices."

---

#### Q: "Have you used serverless before?"

**Your Answer:**
"Yes, I have experience with serverless architecture in several contexts:

**AWS Lambda:**
- Deployed Node.js functions for API endpoints
- Used with API Gateway for RESTful services
- Configured IAM roles and environment variables

**Serverless Framework:**
- Used `serverless.yml` to define infrastructure as code
- Deployed Lambda functions with API Gateway integration
- Managed multi-stage environments (dev/staging/prod)

**Other Serverless Platforms:**
- **Supabase** – PostgreSQL backend with auto-generated APIs
- **Firebase** – Cloud Functions for backend logic
- **Vercel** – Deployed Next.js apps with serverless functions

**Key Concepts I Understand:**
- Cold starts and optimization strategies
- Event-driven architecture
- Stateless function design
- Environment variable management
- Cost optimization (pay-per-execution model)
- Scaling considerations

I'm comfortable with the serverless mindset: small, focused functions that scale automatically and infrastructure managed through configuration rather than manual setup."

---

#### Q: "How do you think Baseline works?"

**Your Answer:**
"Based on industry patterns and my experience with deployment tools, here's my hypothesis:

#### Q: "How do you think Baseline works?"

**Your Answer:**
"Based on the documentation I've reviewed, here's my understanding of Baseline's workflow:

**Project Setup:**
1. Run `npx @baselinejs/quickstart` which scaffolds the entire project
2. Creates a **monorepo** with packages for API, admin site, and user site
3. Includes TypeScript configuration, ESBuild for fast builds, and Serverless Framework configs

**Project Structure:**
```
my-app/
├── packages/
│   ├── api/          # Node.js Express backend
│   ├── admin/        # React admin dashboard
│   └── web/          # React user-facing site
├── pnpm-workspace.yaml
└── serverless.yml files for each package
```

**Development Flow:**
- Work locally with `pnpm` commands
- Each package runs independently (API on local port, React apps with Vite)
- Authentication through AWS Cognito (works locally and in cloud)
- DynamoDB for data persistence

**Deployment Process:**
1. **Setup:** Configure AWS credentials profile with `pnpm run aws:profile`
2. **Build:** TypeScript compilation with ESBuild
3. **Deploy:** Serverless Framework deploys each package:
   - API → AWS Lambda functions + API Gateway
   - Admin/Web → S3 + CloudFront CDN
   - Cognito user pools for auth
   - DynamoDB tables
4. **Environments:** Separate staging and production deployments
5. **CI/CD:** Automated via Bitbucket Pipelines or GitHub Actions

**Key Commands:**
- `pnpm run setup` - Configure project name and AWS region
- `pnpm run deploy:staging` - Deploy to staging environment
- `pnpm run add:user:staging` - Create admin users
- `pnpm run urls:staging` - Get deployed URLs

**What Makes It Powerful:**
- One command deployment across all services
- Environment variables managed through AWS Systems Manager
- CloudWatch logs automatically configured
- Infrastructure as code - reproducible and versionable
- All infrastructure in your AWS account (no vendor lock-in)

The framework essentially provides an opinionated but flexible structure that follows serverless best practices while letting developers focus on building features rather than configuring infrastructure."

---

### 4. Connect to Your Project (20 minutes)

Look at your current `giphy-search` project and how it relates to Baseline:

**Similarities You Already Have:**
- [x] ✅ **Serverless Framework** - You're using `serverless.yml` just like Baseline does
- [x] ✅ **React + TypeScript** - Your frontend matches Baseline's tech stack
- [x] ✅ **Bitbucket Pipelines** - CI/CD setup like Baseline supports
- [x] ✅ **Deployment Scripts** - You understand the deployment workflow

**What Baseline Adds:**
- [ ] 📦 **Monorepo structure** with pnpm (vs single repo)
- [ ] 🏗️ **Full-stack scaffolding** (API + Admin + User site together)
- [ ] 🔒 **Built-in authentication** with AWS Cognito
- [ ] 🗄️ **DynamoDB integration** for serverless database
- [ ] 🔧 **Multiple environments** managed through framework
- [ ] ⚡ **ESBuild** for faster builds (you might be using Webpack/Vite)

**Talking Points:**
"My giphy-search project demonstrates I understand the core concepts Baseline is built on:

1. **Serverless Framework** - I've defined Lambda functions in `serverless.yml` and deployed to AWS
2. **React + TypeScript** - Production-ready frontend with proper typing
3. **CI/CD** - Automated deployments through Bitbucket Pipelines
4. **AWS Services** - Experience with Lambda, API Gateway, S3, CloudFront

**What excites me about Baseline:**
- The monorepo structure will help manage full-stack applications better
- Having authentication built-in will save tons of setup time
- The opinionated structure means faster onboarding and consistency across projects
- I can contribute to open source if I find improvements

**My Learning Plan:**
- Study the Baseline GitHub repo to understand the monorepo structure
- Set up a local Baseline project to experiment
- Learn the pnpm workspace patterns
- Understand how Cognito integration works in their setup"

**Action Items:**
- [ ] Clone the Baseline GitHub repo and explore the code
- [ ] Run `npx @baselinejs/quickstart` to create a test project
- [ ] Compare your serverless.yml with Baseline's approach
- [ ] Watch the [Baseline Demo video](https://www.youtube.com/watch?v=db5gxYWAf1E)

---

## 📝 Key Takeaways to Memorize

### About Devika
- [ ] 3 specific facts about their company
- [ ] 2 reasons you want to work there
- [ ] 1 question about their recent projects

### About Baseline
- [ ] Can explain what it likely does (30-second version)
- [ ] Can describe probable architecture (2-minute version)
- [ ] Can relate it to your experience

### Your Serverless Experience
- [ ] 3 specific examples ready to share
- [ ] AWS services you've used
- [ ] Challenges you've solved

---

## ✅ End of Day Checklist

- [ ] Researched Devika thoroughly (company, culture, recent projects)
- [ ] Understand what Baseline IS (open-source fullstack framework)
- [ ] Can explain Baseline's architecture (monorepo, React, Node, AWS services)
- [ ] Practiced answering 3 key questions with accurate info
- [ ] Explored Baseline documentation and GitHub repo
- [ ] Watched at least one Baseline demo video
- [ ] Connected Baseline concepts to your giphy-search project
- [ ] (BONUS) Run `npx @baselinejs/quickstart` to see it in action
- [ ] Feel confident discussing their tech stack

**Self-Assessment:**
- [ ] Can I explain Baseline in 30 seconds? ⏱️
- [ ] Can I describe the technology stack? 🛠️
- [ ] Can I relate my experience to their needs? 🎯
- [ ] Do I have questions ready to ask them? ❓

---

## 📌 Notes & Insights

**Important Facts About Baseline:**
1. **Open source** - Not proprietary! Can explore code on GitHub
2. **Monorepo with pnpm** - Different from single-repo projects
3. **Full-stack framework** - Not just deployment, includes API + Admin + User site
4. **Your AWS account** - You own the infrastructure
5. **Quick start is ONE command**: `npx @baselinejs/quickstart`

**Tech Stack to Emphasize:**
- ✅ React + Vite (modern, fast)
- ✅ TypeScript + ESBuild (type-safe, fast builds)
- ✅ Node.js + Express (familiar backend)
- ✅ Serverless Framework (infrastructure as code)
- ✅ pnpm (efficient package manager)

**Write down:**
- Interesting facts about Devika:
  
- Questions to ask them:
  1. How does Devika customize Baseline for client projects?
  2. What patterns have you found most effective in Baseline projects?
  3. Do you contribute back to the Baseline open-source project?
  
- Concerns to address:
  - Show enthusiasm for learning the monorepo structure
  - Demonstrate understanding of serverless architecture
  - Highlight React + TypeScript experience

---

## 🎓 Resources

### Official Baseline Resources:
- [ ] 📚 **Baseline Docs**: https://docs.baselinejs.com/
- [ ] 💻 **GitHub Repo**: https://github.com/Baseline-JS/core
- [ ] 🎥 **Baseline Demo Video**: https://www.youtube.com/watch?v=db5gxYWAf1E
- [ ] 🎥 **Baseline Workshop**: https://youtu.be/YWh5iVaTq_w
- [ ] 🌐 **Website**: https://baselinejs.com/
- [ ] 💬 **Discord Community**: https://discord.gg/beCj9VDeMm
- [ ] 📱 **LinkedIn**: https://www.linkedin.com/company/baselinejs

### To Research:
- [ ] Devika website (company background)
- [ ] Devika LinkedIn (recent projects, team)
- [ ] pnpm workspaces (monorepo management)
- [ ] AWS Cognito (authentication service)
- [ ] DynamoDB best practices

### Related Technologies to Refresh:
- [ ] Serverless Framework docs
- [ ] React + Vite (faster than create-react-app)
- [ ] ESBuild (faster than Webpack)
- [ ] TypeScript advanced patterns
- [ ] AWS Lambda optimization

---

**Tomorrow (Day 2):** Deep dive into React patterns and best practices used in production environments.

**Time Investment Today:** ~2.5 hours  
**Priority:** HIGH – This sets the foundation for all other prep
