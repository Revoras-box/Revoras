pipeline {
    agent any

    environment {
        IMAGE = "cyrossachin/revoras-frontend"
        CONTAINER = "revoras-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Revoras-box/Revoras.git'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE:$BUILD_NUMBER -t $IMAGE:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE:$BUILD_NUMBER'
                    sh 'docker push $IMAGE:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop $CONTAINER || true
                    docker rm -f $CONTAINER || true
                    docker ps -q --filter "publish=3000" | xargs -r docker rm -f || true
                    sleep 2
                    docker pull $IMAGE:latest
                    docker run -d \
                        --name $CONTAINER \
                        --restart always \
                        -p 3000:3000 \
                        -e NEXT_PUBLIC_API_URL=https://api.revoras.tech \
                        $IMAGE:latest
                '''
            }
        }
    }

    post {
        failure {
            echo 'Frontend build failed!'
        }
    }
}