# Builder stage
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python -m venv /opt/venv
# Enable the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Final stage
FROM python:3.11-slim

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set working directory
WORKDIR /app

# Copy the virtual environment from the builder
COPY --from=builder /opt/venv /opt/venv
# Copy the application code
COPY . .

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Use the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Expose port
EXPOSE 8001

# Command to run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
