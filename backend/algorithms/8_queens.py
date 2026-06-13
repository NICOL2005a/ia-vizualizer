import random
import math

def contarConflictos(r, n):
    conflictos = 0
    for i in range(n):
        for j in range(i + 1, n):
            if r[i] == r[j] or abs(i - j) == abs(r[i] - r[j]):
                conflictos += 1
    return conflictos

def conflictoReina(r, n, k):
    conflictos = 0
    for i in range(n):
        if i != k:
            if r[i] == r[k] or abs(k - i) == abs(r[k] - r[i]):
                conflictos += 1
    return conflictos

def hillClimbing(r, n):
    mejora = True
    while mejora:
        mejora = False
        for k in range(n):
            conflictoActual = conflictoReina(r, n, k)
            colActual = r[k]
            mejorCol = colActual
            mejorConflicto = conflictoActual

            for col in range(n):
                r[k] = col
                c = conflictoReina(r, n, k)
                if c < mejorConflicto:
                    mejorConflicto = c
                    mejorCol = col

            r[k] = mejorCol
            if mejorCol != colActual:
                mejora = True

    return contarConflictos(r, n) == 0

def reinasHillClimbing(n):
    intentos = 0
    while True:
        intentos += 1
        r = [-1] * n
        for i in range(n):
            r[i] = random.randint(0, n - 1)

        if hillClimbing(r, n):
            print("Solucion encontrada en intento " + str(intentos) + ":")
            for i in range(n):
                print(str(r[i]) + " , ", end="")
            print()
            return

def main():
    n = int(input("Ingrese el numero de reinas a usar en el tablero: "))
    reinasHillClimbing(n)

if __name__ == "__main__":
    main()