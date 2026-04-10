pipeline {
    agent any

    environment {
        DOCKER_HUB = "darshanar28"
    }

    tools {
        maven 'Maven'
    }

    stages {

        // 1. CLONE CODE
        stage('Clone Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        // 2. BUILD BACKEND SERVICES
        stage('Build Backend Services') {
            steps {
                echo "Building Spring Boot services..."
                bat '''
                cd event-management
                call mvn clean package -DskipTests

                cd ../inventory-service
                call mvn clean package -DskipTests

                cd ../chatbot_service
                call mvn clean package -DskipTests
                '''
            }
        }

        // 3. BUILD DOCKER IMAGES
        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                bat '''
                docker build -t %DOCKER_HUB%/event-service-v2:latest ./event-management
                docker build -t %DOCKER_HUB%/inventory-service-v2:latest ./inventory-service
                docker build -t %DOCKER_HUB%/chatbot-service-v2:latest ./chatbot_service
                docker build -t %DOCKER_HUB%/frontend-v2:latest ./event_frontend
                '''
            }
        }

        // 4. PUSH TO DOCKER HUB
        stage('Push Docker Images') {
            steps {
                echo "Pushing images..."
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS' 
                )]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                    docker push %DOCKER_HUB%/event-service-v2:latest
                    docker push %DOCKER_HUB%/inventory-service-v2:latest
                    docker push %DOCKER_HUB%/chatbot-service-v2:latest
                    docker push %DOCKER_HUB%/frontend-v2:latest 
                    '''
                }
            }
        }

        // 5. DEPLOY APPLICATION
        stage('Deploy Application') {
            steps {
                echo "Deploying with docker-compose..."
                bat '''
                docker-compose down
                docker-compose pull
                docker-compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs!"
        }
    }
}