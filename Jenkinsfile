pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        S3_BUCKET          = 'bash.ogulcanaydogan.com'
        CLOUDFRONT_DIST_ID = 'E2AB9D5D7EWDT5'
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

        stage('Deploy to S3') {
            steps {
                sh '''
                  echo "Deploying dist/ to s3://$S3_BUCKET"

                  if [ ! -d "dist" ]; then
                    echo "dist/ folder missing, aborting."
                    exit 1
                  fi

                  aws s3 sync dist "s3://$S3_BUCKET" \
                    --delete \
                    --cache-control "max-age=300"
                '''
            }
        }

        stage('Invalidate CloudFront') {
            steps {
                sh '''
                  echo "Invalidating CloudFront distribution $CLOUDFRONT_DIST_ID"
                  aws cloudfront create-invalidation \
                    --distribution-id "$CLOUDFRONT_DIST_ID" \
                    --paths "/*"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
