# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY .mvn .mvn

# Copy the source code
COPY src ./src

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on
EXPOSE 8081

# Run the jar file
CMD ["java", "-jar", "target/technova-0.0.1-SNAPSHOT.jar"]