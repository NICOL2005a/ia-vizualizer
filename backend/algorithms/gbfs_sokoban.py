from heapq import heappop, heappush

from algorithms.sokoban_common import (
    DIRECTIONS,
    is_free,
    is_goal_state,
    parse_sokoban_board,
    sokoban_heuristic,
)


def solve_sokoban_gbfs(board):
    rows, cols, player, boxes, targets = parse_sokoban_board(board)
    start_state = (player, boxes)
    open_list = []

    heappush(
        open_list,
        (
            sokoban_heuristic(boxes, targets),
            0,
            start_state,
            [],
        ),
    )

    visited = set()

    while open_list:
        _priority, cost, state, path = heappop(open_list)
        player_pos, boxes_state = state
        key = (player_pos, boxes_state)

        if key in visited:
            continue

        visited.add(key)

        if is_goal_state(boxes_state, targets):
            return {
                "solution": path,
                "visited": len(visited),
                "cost": cost,
            }

        for dr, dc, action in DIRECTIONS:
            next_player = (player_pos[0] + dr, player_pos[1] + dc)

            if next_player in boxes_state:
                next_box = (next_player[0] + dr, next_player[1] + dc)

                if not is_free(board, rows, cols, next_box, boxes_state):
                    continue

                new_boxes = list(boxes_state)
                index = new_boxes.index(next_player)
                new_boxes[index] = next_box
                new_boxes = tuple(sorted(new_boxes))
                new_state = (next_player, new_boxes)
            else:
                if not is_free(board, rows, cols, next_player, boxes_state):
                    continue

                new_state = (next_player, boxes_state)

            new_cost = cost + 1
            new_path = path + [action]
            priority = sokoban_heuristic(new_state[1], targets)

            heappush(open_list, (priority, new_cost, new_state, new_path))

    return {
        "solution": [],
        "visited": len(visited),
        "cost": 0,
    }
