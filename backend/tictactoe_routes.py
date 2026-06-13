from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/tictactoe")

WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

def evaluate(board):
    for a, b, c in WIN_LINES:
        if board[a] == board[b] == board[c] and board[a] != " ":
            return 1 if board[a] == "X" else -1
    return 0

def is_full(board):
    return " " not in board

def minimax(board, maximizing):
    score = evaluate(board)

    if score in [1, -1]:
        return score

    if is_full(board):
        return 0

    if maximizing:
        best = -float("inf")

        for i in range(9):
            if board[i] == " ":
                board[i] = "X"
                best = max(best, minimax(board, False))
                board[i] = " "

        return best

    best = float("inf")

    for i in range(9):
        if board[i] == " ":
            board[i] = "O"
            best = min(best, minimax(board, True))
            board[i] = " "

    return best

def best_move(board):
    best_value = -float("inf")
    move = -1

    for i in range(9):
        if board[i] == " ":
            board[i] = "X"
            value = minimax(board, False)
            board[i] = " "

            if value > best_value:
                best_value = value
                move = i

    return move

@router.post("/jugar")
def play(data: dict):
    board = data.get("tablero")

    if not isinstance(board, list) or len(board) != 9:
        raise HTTPException(status_code=400, detail="Tablero inválido")

    if any(cell not in ["X", "O", " "] for cell in board):
        raise HTTPException(
            status_code=400,
            detail="El tablero solo puede tener X, O o espacios"
        )

    return {
        "casilla": best_move(board)
    }