# Day 4 – Baseline Deep Dive: Architecture, Deployment & Real Implementation

## 🎯 Today's Goal
Understand **how Baseline actually works** by analyzing this exact giphy-search project, which is a **Baseline example/template project**. You'll dissect the deployment architecture, understand serverless configuration, and be prepared to discuss Baseline implementation in your interview.

---

## 📚 Table of Contents
1. [Project Discovery: This IS a Baseline Project](#1-project-discovery)
2. [How Baseline is Used in This Project](#2-baseline-implementation)
3. [Serverless Framework Deep Dive](#3-serverless-framework)
4. [Deployment Architecture](#4-deployment-architecture)
5. [The Baseline Approach vs Traditional Deployment](#5-baseline-vs-traditional)
6. [Interview Talking Points](#6-interview-prep)

---

## 1. Project Discovery: This IS a Baseline Project

### 🔍 Evidence from the Codebase

**package.json reveals:**
```json
{
  "name": "giphy-search",
  "repository": {
    "url": "https://github.com/Baseline-JS/giphy-search"
  },
  "keywords": [
    "serverless",
    "aws",
    "baseline",      // ← Baseline keyword
    "react",
    "typescript",
    "deploy",
    "webpage",
    "s3",
    "cloudfront"
  ],
  "description": "A simple React static site that is deployed to AWS using serverless.",
  "bin": "./scripts/bin.js"  // ← This makes it a template/boilerplate
}
```

**Key Insight:** This project is in the `Baseline-JS` GitHub organization and serves as an **example template** showing how to:
- Build a React TypeScript app
- Deploy it to AWS using Serverless Framework
- Follow Baseline's deployment patterns
- Provide a starter project for others (`bin` script allows `npx @baselinejs/giphy-search my-project`)

---

## 2. Baseline Implementation in This Project

### A. The Installation Script (scripts/bin.js)

This is the **project template installer** - how Baseline distributes starter projects:

```javascript
#!/usr/bin/env node

const projectName = process.argv[2];

async function checkNpmVersion() {
  const npmMajorVersion = parseInt(stdout[0]);
  if (npmMajorVersion < 7) {
    console.log("npm >=7 required, try 'npm install -g npm@7'");
    exit();
  }
}

async function checkNodeVersion() {
  const nodeMajorVersion = stdout.slice(1, stdout.search(/\./));
  if (nodeMajorVersion < 14) {
    console.log("node >=14 required, try 'nvm install 14 && nvm use 14'");
    exit();
  }
}

// Creates project folder, copies files, installs dependencies
console.log(`\nThanks for using Baseline ❤️\n`);
```

**What it does:**
1. ✅ Validates Node.js ≥14 and npm ≥7
2. 📂 Creates new project folder
3. 📋 Copies template files (excluding `.git` and `node_modules`)
4. 📦 Runs `npm install`
5. 🔧 Runs `npm run rename` to customize project name
6. ✨ Project ready to `npm start`

**Usage:**
```bash
npx @baselinejs/giphy-search my-gif-app
cd my-gif-app
npm start
```

### B. The Serverless Configuration (serverless.yml)

This is **Baseline's deployment approach** - Infrastructure as Code using Serverless Framework:

```yaml
service: giphy-search

frameworkVersion: '>=2.0.0 <4.0.0'

plugins:
  - serverless-s3-sync          # Syncs build/ folder to S3
  - serverless-cloudfront-invalidate  # Clears CloudFront cache

custom:
  s3Sync:
    - bucketNameKey: S3Bucket
      localDir: build/          # React build output
  cloudfrontInvalidate:
    - distributionIdKey: 'CDNDistributionId'
      items:
        - '/*'                  # Invalidate all cached files

provider:
  name: aws
  runtime: nodejs14.x
  deploymentMethod: direct
  deploymentPrefix: ${self:service}-${sls:stage}

resources:
  Description: ${self:service} ${opt:stage}
  Resources:
    # S3 Bucket for static files
    Bucket:
      Type: AWS::S3::Bucket
      Properties:
        OwnershipControls:
          Rules:
            - ObjectOwnership: BucketOwnerPreferred
        PublicAccessBlockConfiguration:
          BlockPublicAcls: false
          BlockPublicPolicy: false
    
    # Bucket Policy - allows CloudFront access only
    BucketPolicy:
      Type: AWS::S3::BucketPolicy
      Properties:
        Bucket: !Ref Bucket
        PolicyDocument:
          Statement:
            - Sid: PublicReadGetObject
              Effect: Allow
              Principal:
                Service: cloudfront.amazonaws.com
              Action: s3:GetObject
              Resource: !Join ['', ['arn:aws:s3:::', !Ref Bucket, '/*']]
              Condition:
                StringEquals:
                  AWS:SourceArn: !Join ['', [...]]
    
    # CloudFront Response Policy (no-cache headers)
    CloudfrontResponsePolicy:
      Type: AWS::CloudFront::ResponseHeadersPolicy
      Properties:
        ResponseHeadersPolicyConfig:
          Name: ${self:service}-${opt:stage}-no-cache-headers
          CustomHeadersConfig:
            Items:
              - Header: 'Cache-Control'
                Override: true
                Value: 'no-cache'
    
    # Origin Access Control (OAC) - blocks direct S3 access
    WebsiteCloudFrontDistributionOriginAccessControl:
      Type: AWS::CloudFront::OriginAccessControl
      Properties:
        OriginAccessControlConfig:
          Name: ${self:service}-${opt:stage}-cloudfront-oac
          OriginAccessControlOriginType: s3
          SigningBehavior: always
          SigningProtocol: sigv4
    
    # CloudFront Distribution (CDN)
    WebsiteCloudFrontDistribution:
      Type: AWS::CloudFront::Distribution
      Properties:
        DistributionConfig:
          Enabled: true
          HttpVersion: http2
          Origins:
            - DomainName: !GetAtt Bucket.RegionalDomainName
              Id: !GetAtt Bucket.RegionalDomainName
              OriginAccessControlId: !Ref WebsiteCloudFrontDistributionOriginAccessControl
```

### C. The Deployment Scripts (package.json)

**Baseline's multi-environment deployment pattern:**

```json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=8192 GENERATE_SOURCEMAP=false react-scripts build",
    "test": "react-scripts test --watchAll=false",
    "start": "react-scripts start",
    
    // STAGING ENVIRONMENT
    "deploy:staging": "npm run build && npx serverless deploy --verbose --stage staging --region ap-southeast-2 --aws-profile giphy-search",
    "remove:staging": "npx serverless remove --stage staging --region ap-southeast-2 --aws-profile giphy-search",
    "info:staging": "npx serverless info --verbose --stage staging --region ap-southeast-2 --aws-profile giphy-search",
    
    // PRODUCTION ENVIRONMENT
    "deploy:prod": "npm run build && npx serverless deploy --verbose --stage prod --region ap-southeast-2 --aws-profile giphy-search",
    "remove:prod": "npx serverless remove --stage prod --region ap-southeast-2 --aws-profile giphy-search",
    "info:prod": "npx serverless info --verbose --stage prod --region ap-southeast-2 --aws-profile giphy-search",
    
    // SETUP UTILITIES
    "rename": "./scripts/rename.sh",
    "aws:profile": "./scripts/setup-aws-profile.sh giphy-search"
  }
}
```

---

## 3. Serverless Framework Deep Dive

### What is Serverless Framework?

**Serverless Framework** is Infrastructure as Code (IaC) tool that Baseline uses under the hood. It abstracts AWS CloudFormation complexity.

**Key Concept:**
```
Your Code (React App)
      ↓
serverless.yml (Infrastructure Definition)
      ↓
Serverless Framework (IaC Tool)
      ↓
AWS CloudFormation (AWS's IaC Service)
      ↓
AWS Resources (S3, CloudFront, etc.)
```

### How Deployment Works

**Step-by-step breakdown of `npm run deploy:staging`:**

```bash
# 1. Build React app
npm run build
# → Outputs to build/ folder
# → Optimized production bundle
# → No source maps (GENERATE_SOURCEMAP=false)
# → Max memory allocation for large apps (8GB)

# 2. Deploy with Serverless
npx serverless deploy --verbose --stage staging --region ap-southeast-2 --aws-profile giphy-search
```

**What happens during deployment:**

1. **Package Phase:**
   - Serverless reads `serverless.yml`
   - Generates CloudFormation template
   - Packages application code

2. **CloudFormation Stack Creation:**
   - Creates/updates CloudFormation stack: `giphy-search-staging`
   - Provisions resources:
     - S3 bucket: `giphy-search-staging-bucket-xyz123`
     - CloudFront distribution: `E1ABCD2EFGHIJ3`
     - Bucket policies and OAC
     - Response headers policy

3. **File Sync (via serverless-s3-sync plugin):**
   - Uploads `build/` folder contents to S3
   - Only uploads changed files (checksums compared)
   - Sets proper content types

4. **Cache Invalidation (via serverless-cloudfront-invalidate):**
   - Sends CloudFront invalidation request for `/*`
   - Clears cached files from edge locations worldwide
   - Ensures users get latest version

5. **Outputs:**
   ```
   Service Information
   service: giphy-search
   stage: staging
   region: ap-southeast-2
   stack: giphy-search-staging
   resources: 6
   
   Stack Outputs:
   S3Bucket: giphy-search-staging-bucket-abc123
   CDNDistributionId: E1ABCD2EFGHIJ3
   WebsiteURL: https://d1y4ctart84nsw.cloudfront.net
   ```

---

## 4. Deployment Architecture

### AWS Resources Created

```
┌─────────────────────────────────────────────────────────┐
│                     USER REQUEST                        │
│              https://d1y4ctart84nsw.cloudfront.net      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│               CLOUDFRONT (CDN)                          │
│  • Global edge locations (100+ worldwide)               │
│  • HTTPS/HTTP2 enabled                                  │
│  • Cache-Control: no-cache headers                      │
│  • Origin Access Control (OAC) configured               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   S3 BUCKET                             │
│  • Name: giphy-search-staging-bucket-xyz123             │
│  • Contains: build/ folder contents                     │
│    - index.html                                         │
│    - static/css/main.*.css                              │
│    - static/js/main.*.js                                │
│    - favicon.ico, logos, etc.                           │
│  • Direct access BLOCKED (CloudFront only)              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              CLOUDFORMATION STACK                       │
│  Manages all resources as a single unit                 │
│  • Stack name: giphy-search-staging                     │
│  • Resources: 6 (Bucket, Policy, OAC, Distribution...)  │
│  • Can delete entire stack with one command             │
└─────────────────────────────────────────────────────────┘
```

### Security Architecture

**Origin Access Control (OAC):**
```yaml
# CloudFront can access S3
WebsiteCloudFrontDistributionOriginAccessControl:
  Type: AWS::CloudFront::OriginAccessControl
  Properties:
    OriginAccessControlConfig:
      SigningBehavior: always
      SigningProtocol: sigv4

# S3 bucket policy allows ONLY CloudFront
BucketPolicy:
  PolicyDocument:
    Statement:
      - Effect: Allow
        Principal:
          Service: cloudfront.amazonaws.com
        Action: s3:GetObject
        Condition:
          StringEquals:
            AWS:SourceArn: !Join ['', ['arn:aws:cloudfront::', ...]]
```

**Result:**
- ✅ Users access via CloudFront: `https://d1y4ctart84nsw.cloudfront.net`
- ❌ Direct S3 access blocked: `https://giphy-search-staging-bucket.s3.amazonaws.com`
- 🔒 Only CloudFront (with correct OAC) can read from S3
- 🌍 Content served from nearest edge location (low latency)

---

## 5. Baseline vs Traditional Deployment

### Traditional React Deployment (Vercel/Netlify)

**Simple approach:**
```bash
npm install -g vercel
vercel deploy
```

**What you get:**
- ✅ Easy deployment
- ✅ Automatic HTTPS
- ✅ CDN included
- ❌ Vendor lock-in
- ❌ Limited AWS integration
- ❌ Can't customize infrastructure
- ❌ No direct control over resources

### Baseline Deployment Approach

**Baseline philosophy:**
```bash
npm run deploy:staging
```

**What you get:**
- ✅ **Own your infrastructure** (deployed to YOUR AWS account)
- ✅ **Full customization** (edit serverless.yml as needed)
- ✅ **Multi-environment** (staging, prod, dev, etc.)
- ✅ **AWS integration ready** (add Lambda, DynamoDB, Cognito, etc.)
- ✅ **Infrastructure as Code** (version controlled, reproducible)
- ✅ **Team collaboration** (multiple AWS profiles)
- ✅ **Cost transparency** (see exactly what you're paying for)
- ⚠️ **Requires AWS knowledge** (learning curve)
- ⚠️ **More setup** (AWS account, credentials, profiles)

### Comparison Table

| Feature | Vercel/Netlify | Baseline (Serverless) |
|---------|---------------|----------------------|
| **Deployment Speed** | ⚡ Instant | 🐢 2-5 minutes |
| **Setup Complexity** | 🟢 Beginner | 🟡 Intermediate |
| **Infrastructure Control** | ❌ None | ✅ Full |
| **AWS Integration** | ❌ Limited | ✅ Native |
| **Cost Model** | Per-project pricing | AWS usage-based |
| **Scalability** | Auto (vendor managed) | Auto (you manage) |
| **Custom Domains** | ✅ Easy | ✅ Requires Route53 |
| **Environment Variables** | ✅ GUI | ✅ AWS Systems Manager |
| **Preview Deployments** | ✅ Auto | ⚠️ Manual stages |
| **Backend Integration** | Serverless Functions | Full Lambda control |
| **Database** | Vendor-specific | Any AWS service |
| **Authentication** | Vendor auth | AWS Cognito |

---

## 6. Interview Preparation

### A. How to Explain Baseline in This Project

**Short Answer (30 seconds):**
> "This giphy-search project is a Baseline example that demonstrates their deployment approach. It uses Serverless Framework to deploy a React TypeScript app to AWS. The `serverless.yml` file defines infrastructure as code - S3 for static hosting, CloudFront for CDN, and Origin Access Control for security. Running `npm run deploy:staging` builds the React app and deploys everything to AWS in minutes."

**Detailed Answer (2 minutes):**
> "I've been studying this giphy-search project which is an official Baseline example. It showcases how Baseline approaches React deployment using Infrastructure as Code.
> 
> The architecture is built on Serverless Framework, which abstracts AWS CloudFormation. The serverless.yml file defines all AWS resources: an S3 bucket for static hosting, CloudFront distribution for global CDN, bucket policies for security, and Origin Access Control to ensure users can only access content through CloudFront, not directly from S3.
> 
> What I find elegant is the deployment workflow. Running `npm run deploy:staging` first builds the React app with optimized production settings, then Serverless Framework packages everything into CloudFormation templates, creates or updates the AWS stack, syncs the build folder to S3, and invalidates CloudFront cache so users immediately get the latest version.
> 
> The project also demonstrates multi-environment strategy with separate staging and production deployments using AWS profiles. This aligns with Baseline's philosophy of giving developers full control over their infrastructure while maintaining the convenience of modern deployment tools."

### B. Common Interview Questions

**Q1: "What's the difference between Baseline and Vercel?"**

**Answer:**
> "The key difference is infrastructure ownership and control. Vercel is a managed platform where you deploy to their infrastructure - it's fast and simple but you're locked into their ecosystem. Baseline uses Serverless Framework to deploy to YOUR AWS account, giving you full control and customization.
> 
> For example, in this giphy-search project, I can see exactly how CloudFront, S3, and Origin Access Control are configured in serverless.yml. If I wanted to add AWS Lambda functions, DynamoDB tables, or Cognito authentication, I'd just add them to this file. With Vercel, you're limited to their abstractions.
> 
> Baseline is better when you need AWS integrations, want to avoid vendor lock-in, or need infrastructure transparency for compliance. Vercel is better for rapid prototyping or teams without AWS expertise."

**Q2: "Walk me through what happens when you run `npm run deploy:staging`"**

**Answer:**
> "Sure! Let me break down the deployment pipeline:
> 
> First, `npm run build` executes. React Scripts compiles TypeScript, bundles JavaScript with webpack, optimizes assets, and outputs everything to the build/ folder. The NODE_OPTIONS flag allocates 8GB memory for large apps, and GENERATE_SOURCEMAP=false reduces bundle size.
> 
> Then, `serverless deploy` kicks in. Serverless Framework reads serverless.yml and generates AWS CloudFormation templates. It packages the infrastructure definition and deploys it as a CloudFormation stack called 'giphy-search-staging'.
> 
> CloudFormation provisions the resources: creates the S3 bucket with proper ownership controls, sets up the bucket policy that only allows CloudFront access using Origin Access Control, configures response headers policy for cache control, and creates the CloudFront distribution with HTTP/2 enabled.
> 
> Next, the serverless-s3-sync plugin uploads files from build/ to S3, comparing checksums to only upload changed files for efficiency. Finally, serverless-cloudfront-invalidate sends an invalidation request for '/*', clearing cached files from all edge locations worldwide.
> 
> The whole process takes 2-5 minutes and outputs the CloudFront URL where the site is live."

**Q3: "How would you add a backend API to this project?"**

**Answer:**
> "I'd extend the serverless.yml to add Lambda functions and API Gateway. Here's the approach:
> 
> First, create an `api/` folder with Lambda handlers, similar to Baseline's full stack structure. For example, `api/handlers/search.js` for Giphy search logic.
> 
> Then in serverless.yml, I'd add a functions section:
> ```yaml
> functions:
>   searchGifs:
>     handler: api/handlers/search.handler
>     events:
>       - http:
>           path: /api/search
>           method: get
>           cors: true
> ```
> 
> Serverless Framework would automatically create API Gateway endpoints, set up CORS, handle Lambda permissions, and give me a REST API URL. I'd store the Giphy API key in AWS Systems Manager Parameter Store or Secrets Manager instead of environment variables for security.
> 
> If I needed a database, I'd add a DynamoDB table resource in the same serverless.yml file and give Lambda IAM permissions to access it. This demonstrates Baseline's philosophy: start simple with static hosting, then scale up by adding AWS services as needed, all in one configuration file."

**Q4: "What's Origin Access Control and why is it important?"**

**Answer:**
> "Origin Access Control, or OAC, is a CloudFront feature that securely connects CloudFront to S3 while blocking direct public access to the bucket.
> 
> Without OAC, you'd have two options: make the S3 bucket public (security risk, users could bypass CloudFront), or use the older Origin Access Identity (OAI) which AWS is deprecating.
> 
> In this project's serverless.yml, the OAC is configured with SigningBehavior 'always' and SigningProtocol 'sigv4'. CloudFront uses AWS Signature Version 4 to authenticate every request to S3. The bucket policy explicitly allows only requests from CloudFront's ARN.
> 
> This architecture ensures:
> 1. Users can ONLY access content through CloudFront (enforces CDN usage)
> 2. S3 bucket stays private (better security)
> 3. You get benefits of CloudFront: caching, DDoS protection, custom SSL certificates
> 4. All access is logged and traceable through CloudFront logs
> 
> It's a security best practice for production deployments, which is why Baseline includes it by default in their templates."

**Q5: "How do environments work in Baseline? How would you manage staging vs production?"**

**Answer:**
> "Baseline uses Serverless Framework's stage concept for environment management. Each stage creates a completely separate set of AWS resources.
> 
> In this project, the deploy scripts show the pattern:
> ```bash
> npm run deploy:staging  # Creates giphy-search-staging stack
> npm run deploy:prod     # Creates giphy-search-prod stack
> ```
> 
> The `--stage` flag parameterizes resource names using `${self:service}-${sls:stage}`. So staging gets 'giphy-search-staging-bucket-xyz', while prod gets 'giphy-search-prod-bucket-abc'. They're completely isolated - separate S3 buckets, separate CloudFront distributions, separate CloudFormation stacks.
> 
> The `--aws-profile` flag uses different AWS credentials, so you could even deploy staging and prod to different AWS accounts for maximum security and billing separation.
> 
> For environment-specific config, I'd use Serverless variables:
> ```yaml
> custom:
>   apiDomain:
>     staging: api-staging.myapp.com
>     prod: api.myapp.com
> 
> provider:
>   environment:
>     API_URL: ${self:custom.apiDomain.${sls:stage}}
> ```
> 
> You'd test changes in staging first, verify everything works, then promote to production with the exact same deployment command but different stage parameter. This is Infrastructure as Code in action - same configuration, different parameters, reproducible deployments."

### C. Demonstrating Knowledge

**Things you can confidently say:**

✅ "I've worked with the giphy-search Baseline example project"

✅ "I understand how Serverless Framework deploys to AWS using CloudFormation"

✅ "I've seen how serverless.yml defines infrastructure as code"

✅ "I'm familiar with multi-environment deployments using stages"

✅ "I understand the CloudFront + S3 + OAC architecture for static sites"

✅ "I know how the deployment pipeline works from build to production"

✅ "I can explain the difference between Baseline's approach and managed platforms like Vercel"

**Questions you can ask:**

❓ "What's Devika's current Baseline setup? Are you using the full monorepo with API + Admin + User frontends, or more focused apps?"

❓ "How do you handle environment variables and secrets management across Baseline stages?"

❓ "What's your CI/CD setup? Are you using Bitbucket Pipelines or GitHub Actions with Baseline?"

❓ "Do you use Baseline's authentication patterns with Cognito, or have you customized the auth flow?"

❓ "How does Devika handle database migrations in Baseline projects with DynamoDB?"

❓ "What's your strategy for CloudFront cache invalidation during deployments? Do you invalidate everything or specific paths?"

---

## 7. Key Takeaways for Interview

### What Baseline Actually IS

**Baseline = Philosophy + Tooling + Templates**

1. **Philosophy:**
   - Own your infrastructure (not vendor lock-in)
   - Infrastructure as Code (version controlled, reproducible)
   - AWS-native (leverage full AWS ecosystem)
   - Developer productivity (abstracts complexity)

2. **Tooling:**
   - Serverless Framework (core deployment engine)
   - AWS CloudFormation (actual infrastructure provisioning)
   - Plugins (s3-sync, cloudfront-invalidate, etc.)
   - Scripts (setup, rename, deploy helpers)

3. **Templates:**
   - Example projects (like giphy-search)
   - Boilerplate code (React + TypeScript setup)
   - Best practices (OAC, multi-stage, security)
   - Quick start (`npx @baselinejs/quickstart`)

### How This Project Demonstrates Baseline

This giphy-search project is a **learning resource** that shows:

- ✅ Static site deployment pattern (S3 + CloudFront)
- ✅ Infrastructure as Code approach (serverless.yml)
- ✅ Multi-environment setup (staging/prod)
- ✅ Security best practices (OAC, bucket policies)
- ✅ Deployment automation (npm scripts)
- ✅ Project template distribution (bin.js installer)

It's **not** showing the full Baseline stack (no API, no Cognito, no DynamoDB) - it's a focused example of ONE piece: static frontend deployment.

### Connect to Your Experience

**In your interview, bridge YOUR project to Baseline:**

> "I built a Giphy search app with React, TypeScript, and Context API for state management. While working with it, I studied the Baseline giphy-search example project to understand how you'd deploy this to production.
> 
> I learned how Baseline uses Serverless Framework to define infrastructure as code. My project currently runs locally, but with Baseline's approach, I could deploy it to AWS using serverless.yml configuration. The build folder would go to S3, CloudFront would serve it globally, and I'd have separate staging and production environments.
> 
> What I appreciate about Baseline is that it doesn't abstract away AWS - you still see the S3 buckets, CloudFront distributions, and IAM policies in your configuration. This transparency would help me understand what's actually running in production, which I value as a developer.
> 
> If I were to extend my app with a backend, I could add Lambda functions to the same serverless.yml file, maybe use DynamoDB for storing favorite GIFs, and Cognito for user authentication. That's the power of Baseline - you start simple and scale up within the same framework."

---

## 🎯 Day 4 Checklist

- [ ] **Understand the giphy-search project structure**
  - [ ] Read serverless.yml and understand each resource
  - [ ] Review package.json deployment scripts
  - [ ] Examine scripts/bin.js template installer

- [ ] **Master deployment concepts**
  - [ ] Explain the deployment pipeline step-by-step
  - [ ] Understand CloudFormation stacks and resources
  - [ ] Know how serverless-s3-sync and cloudfront-invalidate work

- [ ] **Architecture comprehension**
  - [ ] Draw the CloudFront → S3 architecture
  - [ ] Explain Origin Access Control (OAC)
  - [ ] Understand bucket policies and IAM

- [ ] **Compare deployment approaches**
  - [ ] Baseline vs Vercel/Netlify differences
  - [ ] When to use Infrastructure as Code
  - [ ] Advantages of AWS-native deployment

- [ ] **Practice interview answers**
  - [ ] 30-second Baseline explanation
  - [ ] 2-minute detailed explanation
  - [ ] Answers to Q1-Q5 above
  - [ ] Prepare your own questions about Devika's setup

- [ ] **Connect to your experience**
  - [ ] How your giphy-search project relates to Baseline
  - [ ] How you'd deploy your project with Baseline
  - [ ] How you'd extend it with backend services

---

## 📖 Additional Resources

- **Serverless Framework Docs:** https://www.serverless.com/framework/docs
- **AWS CloudFormation:** https://docs.aws.amazon.com/cloudformation/
- **CloudFront + S3 Pattern:** https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- **Origin Access Control:** https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#oac-overview
- **Baseline Docs:** https://docs.baselinejs.com/

---

## 🚀 Tomorrow: Day 5

**Preview:** Hands-on practice - Set up AWS credentials, deploy the giphy-search project yourself, and troubleshoot common deployment issues. Experience the full deployment cycle firsthand.

---

**Good luck! You've got this! 💪**
