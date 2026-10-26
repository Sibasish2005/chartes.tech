# Chartes V2 — Production DevOps, CI/CD & Infrastructure Architecture

**Document Version:** 2.0.0  
**Status:** Approved for Implementation  
**Target Milestone:** Production Deployment & Free-Tier Automation  
**Author:** Staff Software Architect & DevOps Lead  
**Last Updated:** 2026-10-26  

---

## 1. DevOps & Infrastructure Overview

Chartes V2 is designed around **Infrastructure as Code (IaC)**, **ephemeral serverless execution**, and a **strictly zero-cost operating budget (₹0)**. All infrastructure components are provisioned, configured, and monitored using automated pipelines.

### 1.1 Infrastructure Topology Map

```
┌────────────────────────────────────────────────────────────────────────┐
│ GitHub Actions CI/CD Pipeline (Automated on git push to main / dev)    │
└────────┬─────────────────────────┬─────────────────────────┬───────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Cloudflare Pages │      │    AWS SAM /     │      │ Oracle Cloud VM  │
│  (Frontend CDN)  │      │ CloudFormation   │      │ (Worker Host)    │
└──────────────────┘      └────────┬─────────┘      └────────┬─────────┘
                                   │                         │
             ┌─────────────────────┼─────────────────────┐   │
             ▼                     ▼                     ▼   ▼
     ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
     │  AWS Lambda  │      │Amazon DynamoDB│      │  Amazon SQS  │
     │ Function URL │      │ (Provisioned)│      │   + DLQ      │
     └──────────────┘      └──────────────┘      └──────────────┘
```

---

## 2. Infrastructure as Code (IaC) — AWS SAM Specification

All AWS serverless resources are declared declaratively in `infra/template.yaml` using the **AWS Serverless Application Model (SAM)**.

### 2.1 Complete `infra/template.yaml` Definition
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Chartes V2 Serverless Infrastructure (FastAPI, DynamoDB, SQS, EventBridge)

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: python3.14
    Architectures:
      - arm64 # Graviton architecture for maximum performance and cost efficiency

Parameters:
  Environment:
    Type: String
    Default: prod
    AllowedValues:
      - prod
      - staging
      - dev

Resources:
  # ============================================================================
  # 1. DynamoDB Tables (Provisioned Mode for Strict Always Free Tier: <= 25 RCU/WCU)
  # ============================================================================
  UsersWorkspacesTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub chartes-users-workspaces-${Environment}
      BillingMode: PROVISIONED
      ProvisionedThroughput:
        ReadCapacityUnits: 5
        WriteCapacityUnits: 5
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
          ProvisionedThroughput:
            ReadCapacityUnits: 5
            WriteCapacityUnits: 5

  SocialAccountsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub chartes-social-accounts-${Environment}
      BillingMode: PROVISIONED
      ProvisionedThroughput:
        ReadCapacityUnits: 5
        WriteCapacityUnits: 5
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
          ProvisionedThroughput:
            ReadCapacityUnits: 5
            WriteCapacityUnits: 5

  PostsJobsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub chartes-posts-jobs-${Environment}
      BillingMode: PROVISIONED
      ProvisionedThroughput:
        ReadCapacityUnits: 10
        WriteCapacityUnits: 10
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
          ProvisionedThroughput:
            ReadCapacityUnits: 10
            WriteCapacityUnits: 10

  # ============================================================================
  # 2. SQS Queues (Standard Queue + Dead Letter Queue)
  # ============================================================================
  PublishingDeadLetterQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub chartes-publishing-dlq-${Environment}
      MessageRetentionPeriod: 1209600 # 14 days

  PublishingQueue:
    Type: AWS::SQS::Queue
    Properties:
      QueueName: !Sub chartes-publishing-queue-${Environment}
      VisibilityTimeout: 300 # 5 minutes for worker processing
      MessageRetentionPeriod: 345600 # 4 days
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt PublishingDeadLetterQueue.Arn
        maxReceiveCount: 3

  # ============================================================================
  # 3. Media Storage (Amazon S3)
  # ============================================================================
  MediaBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub chartes-media-${Environment}-${AWS::AccountId}
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      CorsConfiguration:
        CorsRules:
          - AllowedHeaders: ['*']
            AllowedMethods: [GET, PUT, POST]
            AllowedOrigins: ['*'] # Restrict to Cloudflare Pages domain in prod
            MaxAge: 3600

  # ============================================================================
  # 4. FastAPI Backend Lambda Function & Function URL ($0 API Gateway)
  # ============================================================================
  FastApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub chartes-api-${Environment}
      CodeUri: ../apps/api/
      Handler: app.main.handler
      Environment:
        Variables:
          ENVIRONMENT: !Ref Environment
          USERS_TABLE: !Ref UsersWorkspacesTable
          ACCOUNTS_TABLE: !Ref SocialAccountsTable
          POSTS_TABLE: !Ref PostsJobsTable
          MEDIA_BUCKET: !Ref MediaBucket
          PUBLISHING_QUEUE_URL: !Ref PublishingQueue
          SCHEDULER_ROLE_ARN: !GetAtt SchedulerExecutionRole.Arn
      FunctionUrlConfig:
        AuthType: NONE
        Cors:
          AllowOrigins:
            - '*' # In production: ['https://chartes.pages.dev', 'https://chartes.tech']
          AllowMethods:
            - GET
            - POST
            - PUT
            - DELETE
            - OPTIONS
          AllowHeaders:
            - '*'
          AllowCredentials: true
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersWorkspacesTable
        - DynamoDBCrudPolicy:
            TableName: !Ref SocialAccountsTable
        - DynamoDBCrudPolicy:
            TableName: !Ref PostsJobsTable
        - SQSSendMessagePolicy:
            QueueName: !GetAtt PublishingQueue.QueueName
        - S3CrudPolicy:
            BucketName: !Ref MediaBucket
        - Statement:
            - Effect: Allow
              Action:
                - scheduler:CreateSchedule
                - scheduler:DeleteSchedule
                - scheduler:GetSchedule
              Resource: !Sub arn:aws:scheduler:${AWS::Region}:${AWS::AccountId}:schedule/default/*
            - Effect: Allow
              Action:
                - iam:PassRole
              Resource: !GetAtt SchedulerExecutionRole.Arn

  # ============================================================================
  # 5. EventBridge Scheduler IAM Execution Role
  # ============================================================================
  SchedulerExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Sub chartes-scheduler-role-${Environment}
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: scheduler.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: SqsPublishPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - sqs:SendMessage
                Resource: !GetAtt PublishingQueue.Arn

Outputs:
  ApiEndpointUrl:
    Description: FastAPI Public Function URL
    Value: !GetAtt FastApiFunctionUrl.FunctionUrl
  PublishingQueueUrl:
    Description: SQS Publishing Queue URL
    Value: !Ref PublishingQueue
```

---

## 3. Production CI/CD Pipeline (GitHub Actions)

The repository uses **GitHub Actions** with 4 decoupled workflows:
1. `pr-check.yml`: Code hygiene, linters, and unit tests on pull requests.
2. `deploy-api.yml`: Automated build and deployment of the backend to AWS Lambda via SAM.
3. `deploy-frontend.yml`: Build Next.js 16 static export and deploy to Cloudflare Pages.
4. `deploy-worker.yml`: Automated deployment of the Python worker service to the Oracle VM.

### 3.1 PR Gate Workflow (`.github/workflows/pr-check.yml`)
```yaml
name: Pull Request Quality Gate

on:
  pull_request:
    branches: [main, dev]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.14
        uses: actions/setup-python@v5
        with:
          python-version: '3.14'

      - name: Install uv
        uses: astral-sh/setup-uv@v2

      - name: Lint API with Ruff
        run: |
          cd apps/api
          uv run ruff check .
          uv run ruff format --check .

      - name: Run API Unit Tests
        run: |
          cd apps/api
          uv run pytest

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: apps/web/package-lock.json

      - name: Lint and Typecheck Web
        run: |
          cd apps/web
          npm ci
          npm run lint
```

---

### 3.2 Backend SAM Deployment (`.github/workflows/deploy-api.yml`)
Using **AWS OIDC (OpenID Connect)** authentication—no hardcoded AWS credentials stored in GitHub:

```yaml
name: Deploy Backend API

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'infra/**'

permissions:
  id-token: write
  contents: read

jobs:
  deploy-sam:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDeploymentRole
          aws-region: us-east-1

      - name: Set up Python 3.14
        uses: actions/setup-python@v5
        with:
          python-version: '3.14'

      - name: Setup AWS SAM CLI
        uses: aws-actions/setup-sam@v2

      - name: SAM Build and Deploy
        run: |
          cd infra
          sam build
          sam deploy --no-confirm-changeset --no-fail-on-empty-changeset \
            --stack-name chartes-prod \
            --resolve-s3 \
            --capabilities CAPABILITY_IAM
```

---

### 3.3 Frontend Cloudflare Pages Deployment (`.github/workflows/deploy-frontend.yml`)
```yaml
name: Deploy Frontend to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: apps/web/package-lock.json

      - name: Install Dependencies
        run: |
          cd apps/web
          npm ci

      - name: Build Next.js Static Export
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
        run: |
          cd apps/web
          npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: chartes-web
          directory: apps/web/out
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

---

## 4. Oracle Cloud VM Worker Host Architecture

The background worker runs on the **Oracle Cloud Always Free VM** (1 GB RAM instance). Because memory is restricted, the service must run natively under `systemd` with strict memory cgroups.

### 4.1 Systemd Unit File (`/etc/systemd/system/chartes-worker.service`)
```ini
[Unit]
Description=Chartes V2 SQS Publishing Worker
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/chartes/apps/worker
ExecStart=/home/ubuntu/.cargo/bin/uv run python -m app.main
Restart=always
RestartSec=5

# Strict Memory and Resource Protections for 1 GB RAM VM
MemoryMax=350M
MemoryHigh=300M
CPUQuota=80%

# Environment Variables
Environment=PYTHONUNBUFFERED=1
Environment=ENVIRONMENT=prod
Environment=AWS_REGION=us-east-1
EnvironmentFile=/etc/chartes/worker.env

# Standard Logging
StandardOutput=append:/var/log/chartes/worker.log
StandardError=append:/var/log/chartes/worker-error.log

[Install]
WantedBy=multi-user.target
```

### 4.2 Automated Log Rotation (`/etc/logrotate.d/chartes-worker`)
To avoid consuming the 46 GB disk with stale logs:
```
/var/log/chartes/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        systemctl restart chartes-worker.service > /dev/null 2>&1 || true
    endscript
}
```

---

## 5. Secrets Management & Environment Security

1. **GitHub Secrets Matrix**:
   - `AWS_ACCOUNT_ID`: Used for OIDC deployment.
   - `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID`: Used for frontend static upload.
   - `NEXT_PUBLIC_API_URL`: Points to the deployed Lambda Function URL.
   - `ORACLE_HOST`, `ORACLE_SSH_KEY`: Used for deployment to the worker instance.
2. **Oracle Worker Environment File (`/etc/chartes/worker.env`)**:
   - Permissions: `chmod 600 /etc/chartes/worker.env`, owned by `ubuntu:ubuntu`.
   - Contains encrypted secret keys, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `TOKEN_ENCRYPTION_KEY`, and SQS queue URLs.
   - Excluded from all git commits.

---

## 6. Zero-Dollar Monitoring, Observability & Alarms

To ensure ₹0 cost while maintaining high reliability, we utilize CloudWatch Alarms within the free tier:

### 6.1 CloudWatch Free Tier Budget
- **10 Custom Alarms**: Included in Always Free.
- **5 GB Log Ingestion**: Included in Always Free.
- **5 GB Log Archival**: Included in Always Free.

### 6.2 Production Alarms Configured
1. **Billing Alert (Emergency Stop)**:
   - Metric: `EstimatedCharges` in USD.
   - Threshold: `> $0.01`.
   - Action: Sends urgent alert to Discord Webhook / Email via SNS so any unexpected non-free service is terminated immediately.
2. **Dead Letter Queue (DLQ) Backlog Alert**:
   - Metric: `ApproximateNumberOfMessagesVisible` on `chartes-publishing-dlq-prod`.
   - Threshold: `> 0`.
   - Action: Notifies engineer of permanent social API failures.
3. **Lambda Execution Error Rate**:
   - Metric: `Errors` on `chartes-api-prod`.
   - Threshold: `> 5` errors in a 5-minute period.
4. **DynamoDB Read/Write Throttling**:
   - Metric: `ReadThrottleEvents` and `WriteThrottleEvents`.
   - Threshold: `> 0`. Alerts if 20 RCU/WCU provisioned threshold is breached.

---

## 7. Disaster Recovery & Rollback Runbook

### 7.1 Backend API Rollback
If a faulty deployment causes Lambda errors:
```bash
# 1. Rollback SAM stack to previous CloudFormation version
aws cloudformation rollback-stack --stack-name chartes-prod

# Or redeploy previous stable git commit
git revert HEAD --no-edit
git push origin main
```

### 7.2 Frontend Rollback
Cloudflare Pages keeps an immutable history of every static deployment:
1. Go to **Cloudflare Dashboard** $\to$ **Workers & Pages** $\to$ `chartes-web`.
2. Click **Deployments**.
3. Select the previous green deployment $\to$ Click **Rollback to this deployment**.
4. Rollback executes across global edge CDN in $< 5 \text{ seconds}$.

### 7.3 Worker Recovery on Oracle VM
If the worker crashes or becomes unresponsive:
```bash
# SSH into VM
ssh -i ~/.ssh/oracle.key ubuntu@<oracle-vm-ip>

# Inspect journal logs
journalctl -u chartes-worker.service -n 100 -f

# Check memory cgroup status
systemctl status chartes-worker.service

# Restart service cleanly
sudo systemctl restart chartes-worker.service
```
