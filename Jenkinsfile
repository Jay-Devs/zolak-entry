pipeline {
    agent any
    environment {
        IMG_NAME = 'zolak-entry'
    }
    options {
        buildDiscarder(
            logRotator(
                artifactDaysToKeepStr: '',
                artifactNumToKeepStr: '2',
                daysToKeepStr: '',
                numToKeepStr: '2'
            )
        )
        disableConcurrentBuilds()
    }
    stages {
        stage('Set ENV') {
            steps {
                script {
                    switch (env.BRANCH_NAME) {
                        case 'main':
                            env.ENV_NAME = 'prod'

                            env.ECR_HOST = 'nexus.jaydevs.com:8080'
                            env.ECR = "$ECR_HOST/repository/docker"
                            env.ECR_PROTOCOL = 'http://'
                            env.ECR_CREDENTIALS_ID = 'nexus-credentials'

                            env.BACKEND_PORT = 3111

                            env.TARGET_HOST = 'deployer@34.27.117.85'
                            env.DEPLOYMENT_DIR = "/home/deployer/apps/entry/$ENV_NAME"
                            break
                    }
                }
            }
        }
        stage('Prepare environment file') {
            steps {
                script {
                    sh'''
                        cp .env.$ENV_NAME .intermediate.env
                        echo "# -- dynamic variables" >> .intermediate.env
                        mv .intermediate.env .env
                    '''
                }
            }
        }
        stage('Build & Push image') {
            steps {
                script {
                    docker.withRegistry("$ECR_PROTOCOL$ECR", "$ECR_CREDENTIALS_ID") {
                        image = docker.build("$IMG_NAME:$ENV_NAME-$BUILD_NUMBER", '--build-arg .')
                        image.push()

                        latest_tag = "$ENV_NAME-latest"
                        image.push(latest_tag)
                    }
                }
            }
        }
        stage('Deploy image to target') {
            steps {
                script {
                    sh'''
                        ssh $TARGET_HOST "mkdir -p $DEPLOYMENT_DIR/$BUILD_NUMBER"

                        echo BACKEND_PORT="$BACKEND_PORT" >> .docker.env
                        echo ECR_HOST="$ECR_HOST" >> .docker.env
                        echo IMG_NAME="$IMG_NAME" >> .docker.env
                        echo ENV_NAME="$ENV_NAME" >> .docker.env

                        scp docker-compose.yaml .docker.env \
                            $TARGET_HOST:$DEPLOYMENT_DIR/$BUILD_NUMBER

                        ssh $TARGET_HOST "mv $DEPLOYMENT_DIR/$BUILD_NUMBER/.docker.env \
                            $DEPLOYMENT_DIR/$BUILD_NUMBER/.env"
                    '''

                    withCredentials([usernamePassword(
                        usernameVariable: 'username',
                        passwordVariable: 'password',
                        credentialsId: "$ECR_CREDENTIALS_ID"
                    )]) {
                        sh'''
                            set +x
                            ssh $TARGET_HOST "echo $password | \
                                docker login --username $username --password-stdin $ECR"
                        '''
                    }

                    sh'''
                        ssh $TARGET_HOST "cd $DEPLOYMENT_DIR/$BUILD_NUMBER && \
                            docker compose \
                                up \
                                -d \
                                --build \
                                --pull always \
                                --force-recreate \
                                --remove-orphans"
                    '''
                }
            }
        }
    }
    post {
        success {
            sh'''
                ssh $TARGET_HOST "rm -f $DEPLOYMENT_DIR/latest && \
                    ln -s $DEPLOYMENT_DIR/$BUILD_NUMBER $DEPLOYMENT_DIR/latest"
            '''
        }
        always {
            sh'''
                ssh $TARGET_HOST docker logout $ECR
            '''
        }
    }
}
