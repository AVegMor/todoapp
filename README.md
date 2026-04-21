# TODO App (Spring Boot + PostgreSQL + Nginx)

Aplicacion simple para gestionar tareas: listar, crear, marcar completada/incompleta y eliminar.

## Stack
- Java 21
- Spring Boot
- Maven
- PostgreSQL
- Nginx (reverse proxy en Docker Compose local)
- Docker / Docker Compose
- GitHub Actions
- Kubernetes YAML simple

## Diseno y modo oscuro
- UI moderna y responsive con layout centrado en tarjeta.
- Tema claro/oscuro con variables CSS (sin duplicar estilos).
- Deteccion inicial por `prefers-color-scheme`.
- Toggle manual de tema en la cabecera; guarda preferencia en `localStorage`.

## Estructura
- `src/main/java`: API y logica de negocio
- `src/main/resources/static`: frontend HTML/CSS/JS
- `src/main/resources/db`: `schema.sql` y seed opcional
- `nginx/default.conf`: reverse proxy local
- `k8s/`: manifiestos Kubernetes
- `.github/workflows/ci.yml`: pipeline CI/CD

## Variables de entorno
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SERVER_PORT`

## Uso local con Docker Compose
Flujo de red local: **cliente -> nginx -> app -> postgres**

```bash
docker compose up --build
```

Acceso HTTP: [http://localhost:8080](http://localhost:8080)

## Tests con Maven
```bash
mvn test
```

## Build Docker
```bash
docker build -t your-dockerhub-user/todoapp:latest .
```

## GitHub Actions y Docker Hub
- En PR: tests Maven + build Docker (sin push).
- En push: tests Maven + build Docker.
- Solo en `main`: login y push a Docker Hub (`latest` + SHA corto).

Secrets requeridos en GitHub:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Kubernetes en otro PC
1. Ajustar imagen en `k8s/deployment.yaml`.
2. Editar `k8s/configmap.yaml` con host externo de PostgreSQL.
3. Copiar `k8s/secret.example.yaml` a un secret real con credenciales.
4. Aplicar manifiestos:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.example.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Diferencias por entorno

| Escenario | Dónde corre nginx | Dónde corre app | Dónde corre postgres | Hostname de postgres | Punto de entrada HTTP | Comando de arranque |
|---|---|---|---|---|---|---|
| docker-compose local | Contenedor `nginx` | Contenedor `app` | Contenedor `postgres` | `postgres` | `localhost:8080` (nginx) | `docker compose up --build` |
| k8s en otro PC | No requerido (Service/Ingress reemplaza) | Pod `todoapp` | Externo al cluster | configurable en `SPRING_DATASOURCE_URL` | Service (NodePort/Ingress) | `kubectl apply -f k8s/` |
