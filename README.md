# IA Visualizer

Proyecto desarrollado para la materia de **Fundamentos de Inteligencia Artificial**.

## Descripción

IA Visualizer es una aplicación web interactiva que permite visualizar y experimentar con diferentes algoritmos clásicos de Inteligencia Artificial mediante simulaciones gráficas.

El sistema integra múltiples problemas y técnicas estudiadas en clase dentro de una sola interfaz accesible desde cualquier navegador.

## Características

* Interfaz web desarrollada con React y Vite.
* Backend desarrollado con FastAPI.
* Despliegue en la nube mediante Railway.
* Visualización paso a paso de algoritmos.
* Arquitectura Frontend + Backend desacoplada.

## Módulos Implementados

### Frozen Lake

Implementación del algoritmo de búsqueda **Breadth-First Search (BFS)** para encontrar caminos en un entorno tipo Frozen Lake.

Funciones:

* Configuración del mapa.
* Visualización de nodos visitados.
* Visualización del camino solución.
* Estadísticas de ejecución.

### Sokoban

Implementación del algoritmo **A*** para resolver niveles del juego Sokoban.

Funciones:

* Editor de niveles.
* Resolución automática mediante IA.
* Visualización del proceso de búsqueda.
* Estadísticas e historial.

### Tic-Tac-Toe

Juego de Gato contra una IA basada en el algoritmo **Minimax**.

Funciones:

* Juego jugador vs IA.
* Decisiones óptimas de la computadora.
* Detección de victoria, derrota y empate.

### Problema de las 8 Reinas

Visualización de una solución para el clásico problema de las 8 Reinas.

Funciones:

* Generación automática de solución.
* Representación gráfica del tablero.
* Validación de posiciones seguras.

## Tecnologías Utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Despliegue

* GitHub
* Railway

## Estructura del Proyecto

```text
ia-vizualizer/
│
├── backend/
│   ├── algorithms/
│   ├── main.py
│   ├── tictactoe_routes.py
│   └── 8_reinas_FIA.py
│
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
│
├── public/
├── package.json
└── README.md
```

## Instalación Local

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

## Enlace del Proyecto

Sistema desplegado:

https://ia-vizualizer-production.up.railway.app

## Repositorio

https://github.com/NICOL2005a/ia-vizualizer

## Autores

Cano Nuño Marco Vinicio
López Reyes Claudia Nicol
Rodriguez Velazquez Victor Martin

Proyecto desarrollado como práctica académica para la materia de Fundamentos de Inteligencia Artificial.

