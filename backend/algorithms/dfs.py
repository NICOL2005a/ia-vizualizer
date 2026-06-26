def dfs(board):
    rows = len(board)
    cols = len(board[0])

    start = None
    goal = None

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == "S":
                start = (r, c)
            if board[r][c] == "G":
                goal = (r, c)

    if start is None or goal is None:
        raise ValueError("Debe existir un S y un G")

    directions = [
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1),
        (-1, -1),
        (-1, 1),
        (1, -1),
        (1, 1),
    ]

    stack = [start]
    visited = set()
    parents = {}
    visit_order = []

    while stack:
        current = stack.pop()

        if current in visited:
            continue

        visited.add(current)
        visit_order.append(list(current))

        if current == goal:
            path = []
            node = goal

            while node:
                path.insert(0, list(node))
                node = parents.get(node)

            return {
                "visitedOrder": visit_order,
                "path": path,
            }

        r, c = current

        for dr, dc in reversed(directions):
            nr = r + dr
            nc = c + dc

            if nr < 0 or nr >= rows or nc < 0 or nc >= cols:
                continue

            if board[nr][nc] == "H":
                continue

            neighbor = (nr, nc)

            if neighbor in visited or neighbor in stack:
                continue

            parents[neighbor] = current
            stack.append(neighbor)

    return {
        "visitedOrder": visit_order,
        "path": [],
    }
