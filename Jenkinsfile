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
           2. BUILD + TEST
        ========================== */
        stage('Build & Test Services') {
            parallel {

                stage('Event Service') {
                    steps {
                        bat '''
                        cd event-management
                        mvn clean test package -DskipTests
                        '''
                    }
                }

                stage('Inventory Service') {
                    steps {
                        bat '''
                        cd inventory-service
                        mvn clean test package -DskipTests
                        '''
                    }
                }

                stage('Chatbot Service') {
                    steps {
                        bat '''
                        cd chatbot_service
                        mvn clean test package -DskipTests
                        '''
                    }
                }
            }
        }

        /* =========================
           3. BUILD DOCKER IMAGES
        ========================== */
        stage('Build Docker Images') {

            steps {
                script {

                    eventImage = docker.build(
                        "${DOCKER_HUB}/event-service:${IMAGE_TAG}",
                        "./event-management"
                    )

                    inventoryImage = docker.build(
                        "${DOCKER_HUB}/inventory-service:${IMAGE_TAG}",
                        "./inventory-service"
                    )

                    chatbotImage = docker.build(
                        "${DOCKER_HUB}/chatbot-service:${IMAGE_TAG}",
                        "./chatbot_service"
                    )

                    frontendImage = docker.build(
                        "${DOCKER_HUB}/frontend:${IMAGE_TAG}",
                        "./event_frontend"
                    )
                }
            }
        }

        /* =========================
           4. PUSH TO DOCKER HUB
        ========================== */
        stage('Push Docker Images') {
            steps {
                script {

                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-cred') {

                        // Push versioned images
                        eventImage.push()
                        inventoryImage.push()
                        chatbotImage.push()
                        frontendImage.push()

                        // Tag + push latest safely
                        eventImage.tag("latest")
                        eventImage.push("latest")

                        inventoryImage.tag("latest")
                        inventoryImage.push("latest")

                        chatbotImage.tag("latest")
                        chatbotImage.push("latest")

                        frontendImage.tag("latest")
                        frontendImage.push("latest")
                    }
                }
            }
        }

        /* =========================
           5. DEPLOY APPLICATION
        ========================== */
        stage('Deploy Application') {
            steps {
                echo "Deploying application using docker-compose..."

                bat '''
                docker-compose down -v

                docker-compose up -d --build
                '''
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