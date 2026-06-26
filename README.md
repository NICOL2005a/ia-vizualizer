# IA Visualizer

Proyecto desarrollado para la materia de **Fundamentos de Inteligencia Artificial**.

## Descripcion

IA Visualizer es una aplicacion web interactiva que permite visualizar y experimentar con diferentes algoritmos clasicos de Inteligencia Artificial mediante simulaciones graficas.

El sistema integra multiples problemas y tecnicas estudiadas en clase dentro de una sola interfaz accesible desde cualquier navegador.

## Caracteristicas

* Interfaz web desarrollada con React y Vite.
* Backend desarrollado con FastAPI.
* Despliegue en la nube mediante Railway.
* Visualizacion paso a paso de algoritmos.
* Arquitectura Frontend + Backend desacoplada.
* Modulos interactivos con edicion de escenarios y estadisticas de ejecucion.

## Modulos Implementados

### Frozen Lake

Implementacion de algoritmos de busqueda para encontrar caminos en un entorno tipo Frozen Lake.

Algoritmos disponibles:

* **Breadth-First Search (BFS)**.
* **Depth-First Search (DFS)**.

Funciones:

* Configuracion del mapa.
* Seleccion del algoritmo de busqueda.
* Visualizacion de nodos visitados.
* Visualizacion del camino solucion.
* Estadisticas de ejecucion.

### Sokoban

Implementacion de algoritmos de busqueda informada para resolver niveles del juego Sokoban.

Algoritmos y modos disponibles:

* Juego manual.
* **A\***.
* **Greedy Best-First Search (GBFS)**.

Funciones:

* Editor de niveles.
* Seleccion entre modo manual, A* y GBFS.
* Resolucion automatica mediante IA.
* Ejecucion paso a paso de la solucion encontrada.
* Boton para reiniciar el juego sin borrar el nivel creado.
* Limpieza completa del tablero.
* Estadisticas e historial.

### Tic-Tac-Toe

Juego de Gato contra una IA basada en el algoritmo **Minimax**.

Funciones:

* Juego jugador vs IA.
* Decisiones optimas de la computadora.
* Deteccion de victoria, derrota y empate.

### Problema de las N Reinas

Visualizacion interactiva para el problema de las N Reinas, incluyendo configuracion del tablero y ejecucion paso a paso.

Algoritmos disponibles:

* **Escalada simple**.
* **Maxima pendiente**.
* **Simulated Annealing**.

Funciones:

* Configuracion del tamano del tablero.
* Edicion manual de la posicion de las reinas.
* Generacion aleatoria del tablero.
* Visualizacion de conflictos.
* Visualizacion paso a paso de movimientos.
* Validacion de configuraciones solucion.

## Tecnologias Utilizadas

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
|
|-- backend/
|   |-- algorithms/
|   |   |-- astar_sokoban.py
|   |   |-- bfs.py
|   |   |-- dfs.py
|   |   |-- gbfs_sokoban.py
|   |   |-- sokoban_common.py
|   |   `-- 8_queens.py
|   |-- main.py
|   |-- tictactoe_routes.py
|   `-- 8_reinas_FIA.py
|
|-- src/
|   |-- components/
|   |-- pages/
|   `-- styles/
|
|-- public/
|-- package.json
`-- README.md
```

## Instalacion Local

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

## Verificacion

```bash
npm run lint
npm run build
```

## Enlace del Proyecto

Sistema desplegado:

https://ia-vizualizer-production.up.railway.app

## Repositorio

https://github.com/NICOL2005a/ia-vizualizer

## Autores

Cano Nuno Marco Vinicio  
Lopez Reyes Claudia Nicol  
Rodriguez Velazquez Victor Martin

Proyecto desarrollado como practica final para la materia de Fundamentos de Inteligencia Artificial.
