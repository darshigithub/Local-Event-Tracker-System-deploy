pipeline {
    agent any

    tools {
        maven 'Maven'
    }

    environment {
        DOCKER_HUB = "darshanar28"
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

        // 3. BUILD & PUSH DOCKER IMAGES (PLUGIN WAY)
        stage('Build & Push Docker Images') {
            steps {
                script {

                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-cred') {

                        def eventImage = docker.build("${DOCKER_HUB}/event-service-v2:latest", "./event-management")
                        eventImage.push()

                        def inventoryImage = docker.build("${DOCKER_HUB}/inventory-service-v2:latest", "./inventory-service")
                        inventoryImage.push()

                        def chatbotImage = docker.build("${DOCKER_HUB}/chatbot-service-v2:latest", "./chatbot_service")
                        chatbotImage.push()

                        def frontendImage = docker.build("${DOCKER_HUB}/frontend-v2:latest", "./event_frontend")
                        frontendImage.push()
                    }
                }
            }
        }

        // 4. DEPLOY APPLICATION
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