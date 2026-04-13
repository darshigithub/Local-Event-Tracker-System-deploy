pipeline {
    agent any

    tools {
        maven 'Maven'
    }

    environment {
        DOCKER_HUB = "darshanar28"
        IMAGE_TAG = "v1.${BUILD_NUMBER}"
    }

    stages {

        //   1. CLONE SOURCE CODE
        
        stage('Clone Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        //   2. RUN UNIT TESTS
       
        stage('Run Tests') {
            steps {
                echo "Running unit tests..."
                bat '''
                cd event-management
                call mvn test

                cd ../inventory-service
                call mvn test

                cd ../chatbot_service
                call mvn test
                '''
            }
        }

        //   3. BUILD JAR FILES
       
        stage('Build Applications') {
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

       
        //   4. BUILD DOCKER IMAGES
        
        stage('Build Docker Images') {
            steps {
                script {

                    def eventImage = docker.build(
                        "${DOCKER_HUB}/event-service:${IMAGE_TAG}",
                        "./event-management"
                    )

                    def inventoryImage = docker.build(
                        "${DOCKER_HUB}/inventory-service:${IMAGE_TAG}",
                        "./inventory-service"
                    )

                    def chatbotImage = docker.build(
                        "${DOCKER_HUB}/chatbot-service:${IMAGE_TAG}",
                        "./chatbot_service"
                    )

                    def frontendImage = docker.build(
                        "${DOCKER_HUB}/frontend:${IMAGE_TAG}",
                        "./event_frontend"
                    )
                }
            }
        }

        
        //   5. PUSH TO DOCKER HUB
        
        stage('Push Docker Images') {
            steps {
                script {

                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-cred') {

                        docker.image("${DOCKER_HUB}/event-service:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_HUB}/inventory-service:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_HUB}/chatbot-service:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_HUB}/frontend:${IMAGE_TAG}").push()

                        // also push latest tag
                        docker.image("${DOCKER_HUB}/event-service:${IMAGE_TAG}")
                            .tag("latest").push("latest")
                    }
                }
            }
        }

       
        //   6. DEPLOY USING DOCKER-COMPOSE
       
        stage('Deploy Application') {
            steps {
                echo "Deploying containers using docker-compose..."

                bat '''
                docker-compose down

                docker-compose pull

                docker-compose up -d
                '''
            }
        }
    }

    
    //   7. POST ACTIONS

    post {
        success {
            echo "CI/CD Pipeline executed successfully!"
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