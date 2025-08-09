# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# If you're using the Maven Wrapper, make sure it's executable
COPY . .
RUN chmod +x mvnw || true
# Build a runnable jar (skip tests to speed up CI)
RUN ./mvnw -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar built above
# Adjust the pattern if your JAR name is different
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Render sets PORT; pass it to Spring Boot
# Also add any other -D flags you want (e.g., active profile)
CMD ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
