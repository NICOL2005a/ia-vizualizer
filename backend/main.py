from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from algorithms.bfs import bfs
from algorithms.dfs import dfs
from algorithms.astar_sokoban import solve_sokoban_astar
from algorithms.gbfs_sokoban import solve_sokoban_gbfs
from tictactoe_routes import router as tictactoe_router

app = FastAPI()

app.include_router(tictactoe_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message":
        "Backend IA ok"
    }

@app.post("/bfs")
def execute_bfs(data: dict):

    print("BFS ejecutado desde Python")

    board = data["board"]

    result = bfs(board)

    return result

@app.post("/dfs")
def execute_dfs(data: dict):

    print("DFS ejecutado desde Python")

    board = data["board"]

    result = dfs(board)

    return result

@app.post("/sokoban")
def execute_sokoban(data: dict):
    board = data["board"]
    algorithm = data.get("algorithm", "astar").lower()

    if algorithm == "gbfs":
        return solve_sokoban_gbfs(board)

    return solve_sokoban_astar(board)
