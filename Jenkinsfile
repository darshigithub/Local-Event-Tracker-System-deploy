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

                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                    docker push %DOCKER_HUB%/event-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/inventory-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/chatbot-service:%IMAGE_TAG%
                    docker push %DOCKER_HUB%/frontend:%IMAGE_TAG%

                    docker tag %DOCKER_HUB%/event-service:%IMAGE_TAG% %DOCKER_HUB%/event-service:latest
                    docker tag %DOCKER_HUB%/inventory-service:%IMAGE_TAG% %DOCKER_HUB%/inventory-service:latest
                    docker tag %DOCKER_HUB%/chatbot-service:%IMAGE_TAG% %DOCKER_HUB%/chatbot-service:latest
                    docker tag %DOCKER_HUB%/frontend:%IMAGE_TAG% %DOCKER_HUB%/frontend:latest

                    docker push %DOCKER_HUB%/event-service:latest
                    docker push %DOCKER_HUB%/inventory-service:latest
                    docker push %DOCKER_HUB%/chatbot-service:latest
                    docker push %DOCKER_HUB%/frontend:latest
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                echo "Deploying using Docker Compose..."

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

        always {
            echo "Pipeline finished"
        }

        success {
            emailext(
                to: "darshanar2892003@gmail.com",
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <h2 style="color:green;">Build SUCCESS ✅</h2>

                <b>Job:</b> ${env.JOB_NAME}<br>
                <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                <b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                """
            )
        }

        failure {
            emailext(
                to: "darshanar2892003@gmail.com",
                subject: "❌ FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <h2 style="color:red;">Build FAILED ❌</h2>

                <b>Job:</b> ${env.JOB_NAME}<br>
                <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                <b>Check Logs:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                """
            )
        }

        unstable {
            emailext(
                to: "darshanar2892003@gmail.com",
                subject: "⚠ UNSTABLE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <h2 style="color:orange;">Build UNSTABLE ⚠</h2>

                <b>Job:</b> ${env.JOB_NAME}<br>
                <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                <b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
                """
            )
        }
    }
}