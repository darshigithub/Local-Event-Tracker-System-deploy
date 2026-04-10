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
                sh '''
                cd event-management
                mvn clean package -DskipTests

                cd ../inventory-service
                mvn clean package -DskipTests

                cd ../chatbot_service
                mvn clean package -DskipTests
                '''
            }
        }

        // 3. BUILD DOCKER IMAGES (UPDATED NAMES)
        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                sh '''
                docker build -t $DOCKER_HUB/event-service-v2:latest ./event-management
                docker build -t $DOCKER_HUB/inventory-service-v2:latest ./inventory-service
                docker build -t $DOCKER_HUB/chatbot-service-v2:latest ./chatbot_service
                docker build -t $DOCKER_HUB/frontend-v2:latest ./event_frontend
                '''
            }
        }

        // 4. PUSH TO DOCKER HUB (UPDATED)
        stage('Push Docker Images') {
            steps {
                echo "Pushing images..."
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker push $DOCKER_HUB/event-service-v2:latest
                    docker push $DOCKER_HUB/inventory-service-v2:latest
                    docker push $DOCKER_HUB/chatbot-service-v2:latest
                    docker push $DOCKER_HUB/frontend-v2:latest
                    '''
                }
            }
        }

        // 5. DEPLOY
        stage('Deploy Application') {
            steps {
                echo "Deploying with docker-compose..."
                sh '''
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