# Giphy Search

A React-based Giphy search interface built with TypeScript, deployed to AWS using Serverless Framework.

## Features

- Search for GIFs using the Giphy API
- View trending GIFs on page load
- Copy GIF URLs to clipboard
- Direct links to Giphy pages
- Animated search placeholder
- Responsive grid layout
- Loading states and error handling

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: CSS3 with animations
- **API**: Giphy API (v1), Axios
- **Deployment**: AWS (S3, CloudFront) via Serverless Framework
  
## Setup

### Prerequisites
- Node.js 14+
- npm 7+
- AWS CLI (for deployment)
- Giphy API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/khanhsaan/giphy-search.git
cd giphy-search
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file in the root directory
```bash
REACT_APP_GIPHY_API_KEY=your_api_key_here
```

Get your API key from [Giphy Developers](https://developers.giphy.com/)

### Run Locally

```bash
npm start
```

The app will open at `http://localhost:3000`

### Deploy to AWS

```bash
npm run deploy:staging
```

## Live Demo

https://d1y4ctart84nsw.cloudfront.net/
