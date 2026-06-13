from heapq import heappush, heappop

def solve_sokoban(board):
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

    start_state = (player, tuple(sorted(boxes)))

    def heuristic(boxes_state):
        total = 0
        for box in boxes_state:
            distances = [
                abs(box[0] - t[0]) + abs(box[1] - t[1])
                for t in targets
            ]
            total += min(distances)
        return total

    def is_goal(boxes_state):
        return all(box in targets for box in boxes_state)

    def is_free(pos, boxes_state):
        r, c = pos

        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False

        if board[r][c] == "#":
            return False

        if pos in boxes_state:
            return False

        return True

    directions = [
        (-1, 0, "UP"),
        (1, 0, "DOWN"),
        (0, -1, "LEFT"),
        (0, 1, "RIGHT"),
    ]

    open_list = []
    heappush(
        open_list,
        (
            heuristic(start_state[1]),
            0,
            start_state,
            [],
        ),
    )

    visited = set()

    while open_list:
        f, cost, state, path = heappop(open_list)

        player_pos, boxes_state = state

        key = (player_pos, boxes_state)

        if key in visited:
            continue

        visited.add(key)

        if is_goal(boxes_state):
            return {
                "solution": path,
                "visited": len(visited),
                "cost": cost,
            }

        for dr, dc, action in directions:
            next_player = (
                player_pos[0] + dr,
                player_pos[1] + dc,
            )

            if next_player in boxes_state:
                next_box = (
                    next_player[0] + dr,
                    next_player[1] + dc,
                )

                if not is_free(next_box, boxes_state):
                    continue

                new_boxes = list(boxes_state)
                index = new_boxes.index(next_player)
                new_boxes[index] = next_box
                new_boxes = tuple(sorted(new_boxes))

                new_state = (next_player, new_boxes)

            else:
                if not is_free(next_player, boxes_state):
                    continue

                new_state = (next_player, boxes_state)

            new_cost = cost + 1
            new_path = path + [action]

            priority = new_cost + heuristic(new_state[1])

            heappush(
                open_list,
                (
                    priority,
                    new_cost,
                    new_state,
                    new_path,
                ),
            )

    return {
        "solution": [],
        "visited": len(visited),
        "cost": 0,
    }