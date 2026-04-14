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

        stage('Clone Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

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

        stage('Build Frontend') {
            steps {
                dir('event_frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

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

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat """
                    echo Logging into Docker Hub...
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%

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

        stage('Deploy Application') {
            steps {
                echo "Deploying application using Docker Compose..."

                withCredentials([
                    string(credentialsId: 'postgres-pass', variable: 'DB_PASS'),
                    string(credentialsId: 'postgres-user', variable: 'DB_USER'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                ]) {

                    bat """
                    echo Setting environment variables...

                    set POSTGRES_USER=%DB_USER%
                    set POSTGRES_PASSWORD=%DB_PASS%

                    set SPRING_DATASOURCE_USERNAME=%DB_USER%
                    set SPRING_DATASOURCE_PASSWORD=%DB_PASS%

                    set JWT_SECRET=%JWT_SECRET%

                    echo Stopping old containers...
                    docker compose down -v

                    echo Starting new containers...
                    docker compose up -d

                    echo Deployment completed!
                    """
                }
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

        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}