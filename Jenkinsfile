pipeline {
    agent any

    tools {
        maven 'Maven3'
    }

    environment {
        DOCKER_HUB = "darshanar28"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
    }

    stages {

        /* =========================
           1. CLONE CODE
        ========================== */
        stage('Clone Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        /* =========================
           2. BUILD BACKEND SERVICES
        ========================== */
        stage('Build Backend Services') {
            parallel {

                stage('Event Service') {
                    steps {
                        dir('event-management') {
                            bat 'mvn clean package -DskipTests'
                        }
                    }
                }

                stage('Inventory Service') {
                    steps {
                        dir('inventory-service') {
                            bat 'mvn clean package -DskipTests'
                        }
                    }
                }

                stage('Chatbot Service') {
                    steps {
                        dir('chatbot_service') {
                            bat 'mvn clean package -DskipTests'
                        }
                    }
                }
            }
        }

        /* =========================
           3. BUILD FRONTEND
        ========================== */
        stage('Build Frontend') {
            steps {
                dir('event_frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        /* =========================
           4. BUILD DOCKER IMAGES
        ========================== */
        stage('Build Docker Images') {
            steps {
                bat """
                docker build -t %DOCKER_HUB%/event-service:%IMAGE_TAG% ./event-management
                docker build -t %DOCKER_HUB%/inventory-service:%IMAGE_TAG% ./inventory-service
                docker build -t %DOCKER_HUB%/chatbot-service:%IMAGE_TAG% ./chatbot_service
                docker build -t %DOCKER_HUB%/frontend:%IMAGE_TAG% ./event_frontend
                """
            }
        }

        /* =========================
           5. PUSH TO DOCKER HUB
        ========================== */
        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                    docker push %DOCKER_HUB%/event-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/inventory-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/chatbot-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/frontend:%IMAGE_TAG%

                    docker tag %DOCKER_HUB%/event-service:%IMAGE_TAG% %DOCKER_HUB%/event-service:latest
                    docker push %DOCKER_HUB%/event-service:latest

                    docker tag %DOCKER_HUB%/inventory-service:%IMAGE_TAG% %DOCKER_HUB%/inventory-service:latest
                    docker push %DOCKER_HUB%/inventory-service:latest

                    docker tag %DOCKER_HUB%/chatbot-service:%IMAGE_TAG% %DOCKER_HUB%/chatbot-service:latest
                    docker push %DOCKER_HUB%/chatbot-service:latest

                    docker tag %DOCKER_HUB%/frontend:%IMAGE_TAG% %DOCKER_HUB%/frontend:latest
                    docker push %DOCKER_HUB%/frontend:latest
                    """
                }
            }
        }

        /* =========================
           6. DEPLOY APPLICATION
        ========================== */
        stage('Deploy Application') {
            steps {
                echo "Deploying application using Docker Compose..."

                bat """
                docker compose down -v
                docker compose up -d
                """
            }
        }
    }

    /* =========================
       POST ACTIONS
    ========================== */
    post {
        success {
            echo "Pipeline executed successfully!"
        }

        failure {
            echo "Pipeline failed. Check logs!"
        }

        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}