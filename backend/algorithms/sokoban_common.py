def parse_sokoban_board(board):
    rows = len(board)
    cols = len(board[0])
    player = None
    boxes = []
    targets = []

    for r in range(rows):
        for c in range(cols):
            cell = board[r][c]

            if cell == "P":
                player = (r, c)
            if cell == "B":
                boxes.append((r, c))
            if cell == "T":
                targets.append((r, c))

    if player is None:
        raise ValueError("Debe existir un jugador P")
    if len(boxes) == 0:
        raise ValueError("Debe existir al menos una caja B")
    if len(targets) == 0:
        raise ValueError("Debe existir al menos un objetivo T")

    return rows, cols, player, tuple(sorted(boxes)), targets


def sokoban_heuristic(boxes_state, targets):
    total = 0

    for box in boxes_state:
        distances = [
            abs(box[0] - target[0]) + abs(box[1] - target[1])
            for target in targets
        ]
        total += min(distances)

    return total


def is_goal_state(boxes_state, targets):
    return all(box in targets for box in boxes_state)


def is_free(board, rows, cols, pos, boxes_state):
    r, c = pos

    if r < 0 or r >= rows or c < 0 or c >= cols:
        return False

    if board[r][c] == "#":
        return False

    if pos in boxes_state:
        return False

    return True


DIRECTIONS = [
    (-1, 0, "UP"),
    (1, 0, "DOWN"),
    (0, -1, "LEFT"),
    (0, 1, "RIGHT"),
]
