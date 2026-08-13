# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom first (layer caching — only re-downloads deps if pom changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2: Run ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /app/target/hivenet-0.0.1-SNAPSHOT.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
