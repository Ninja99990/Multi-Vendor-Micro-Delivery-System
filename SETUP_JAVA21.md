# Setting Up Java 21 for API Gateway

## Step 1: Register Java 21 with macOS (Requires Password)

Run this command in your terminal (it will ask for your password):

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

## Step 2: Verify Java 21 is Available

```bash
/usr/libexec/java_home -V
```

You should see both Java 25 and Java 21 listed.

## Step 3: Run API Gateway with Java 21

Use the provided script:

```bash
cd api-gateway
./run-with-java21.sh
```

Or manually:

```bash
cd api-gateway
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
./mvnw spring-boot:run
```

## Alternative: Set Java 21 as Default (Optional)

If you want Java 21 to be your default Java version:

```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Current Status

- ✅ Java 21 installed via Homebrew
- ⏳ Needs to be registered with macOS (Step 1 above)
- ✅ API Gateway configured for Spring Boot 3.3.0
- ✅ Spring Cloud Gateway configured

After completing Step 1, the API Gateway should start successfully!
