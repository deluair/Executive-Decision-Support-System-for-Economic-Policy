# Executive Decision Support System for Economic Policy

A comprehensive platform that transforms complex economic analysis into executive-ready insights, designed to showcase consulting-ready skills in business communication, real-time decision making, and stakeholder management.

## Features

- **Executive Dashboard**: Real-time economic indicators and insights
- **Economic Analysis**: Advanced econometric modeling and forecasting
- **Scenario Planning**: Interactive what-if analysis and simulation
- **Risk Assessment**: Comprehensive risk evaluation and mitigation strategies
- **Stakeholder Communication**: Automated report generation and visualization

## Tech Stack

### Backend
- FastAPI (Python 3.9+)
- PostgreSQL
- Redis
- SQLAlchemy
- Statsmodels
- Pandas
- NumPy

### Frontend
- Next.js 14
- TypeScript
- Material-UI
- Recharts
- SWR for data fetching

## Prerequisites

- Docker and Docker Compose
- Node.js 16+
- Python 3.9+
- PostgreSQL 13+
- Redis

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/deluair/Executive-Decision-Support-System-for-Economic-Policy.git
cd Executive-Decision-Support-System-for-Economic-Policy
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development Setup

### Backend Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

### Frontend Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Project Structure

```
executive_decision_support_system/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   └── alembic/            # Database migrations
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
└── docker/                 # Docker configuration
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when running the backend server. Key endpoints include:

- `/api/v1/indicators/`: Economic indicators management
- `/api/v1/forecast/`: Economic forecasting
- `/api/v1/scenarios/`: Scenario planning
- `/api/v1/risk-assessment/`: Risk assessment

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Contact

For questions and support, please open an issue in the GitHub repository. 