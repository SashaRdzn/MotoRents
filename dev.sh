set -e

echo '🚀 Start dev server'

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_directories() {
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
}

start_frontend() {
    print_status 'Starting dev server frontend'
    
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found, installing dependencies..."
        npm install
    fi
    
    print_status "Starting frontend development server..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

start_backend() {
    print_status 'Starting dev server backend'
    
    cd backend
    
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found, creating..."
        python3 -m venv venv
    fi
    
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    if [ -f "requirements.txt" ]; then
        print_status "Installing Python dependencies..."
        pip install -r requirements.txt
    else
        print_warning "requirements.txt not found, skipping dependency installation"
    fi
    
    print_status "Starting backend development server..."
    python3 manage.py runserver &
    BACKEND_PID=$!
    cd ..
}

cleanup() {
    print_status "Shutting down servers..."
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    print_status "Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

main() {
    check_directories
    start_frontend
    start_backend
    
    print_status "✅ Both servers are starting..."
    print_status "Frontend PID: $FRONTEND_PID"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Press Ctrl+C to stop all servers"
    wait
}

main