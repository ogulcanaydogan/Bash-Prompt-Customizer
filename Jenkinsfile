pipeline {
    agent {
        docker { image 'node:18-bullseye' }
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install tooling') {
            steps {
                sh 'npm install --no-package-lock --progress=false --global npm@10.8.2'
            }
        }

        stage('Format check') {
            steps {
                sh "npx --yes prettier@3.2.5 --check index.html script.js styles.css"
            }
        }

        stage('Lint HTML') {
            steps {
                sh "npx --yes htmlhint@1.1.4 index.html"
            }
        }

        stage('Static export') {
            steps {
                sh "mkdir -p dist && cp index.html styles.css script.js dist/"
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: '**/junit-*.xml'
        }
    }
}
