"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  const [inputArray, setInputArray] = useState("64, 34, 25, 12, 22, 11, 90")
  const [recursiveResult, setRecursiveResult] = useState<number[]>([])
  const [iterativeResult, setIterativeResult] = useState<number[]>([])
  const [recursiveSteps, setRecursiveSteps] = useState<string[]>([])
  const [iterativeSteps, setIterativeSteps] = useState<string[]>([])

  // Рекурсивная быстрая сортировка
  function quickSortRecursive(arr: number[], steps: string[] = []): number[] {
    if (arr.length <= 1) {
      return arr
    }

    // Выбираем опорный элемент (средний)
    const pivotIndex = Math.floor(arr.length / 2)
    const pivot = arr[pivotIndex]

    steps.push(`Опорный элемент: ${pivot}, массив: [${arr.join(", ")}]`)

    // Делим массив на подмассивы
    const left: number[] = []
    const right: number[] = []

    for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) continue

      if (arr[i] < pivot) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }

    steps.push(`Левый подмассив: [${left.join(", ")}], Правый подмассив: [${right.join(", ")}]`)

    // Рекурсивно сортируем подмассивы
    const sortedLeft = quickSortRecursive(left, steps)
    const sortedRight = quickSortRecursive(right, steps)

    // Объединяем результат
    const result = [...sortedLeft, pivot, ...sortedRight]
    steps.push(`Объединение: [${result.join(", ")}]`)

    return result
  }

  // Итерационная быстрая сортировка
  function quickSortIterative(arr: number[]): { result: number[]; steps: string[] } {
    if (arr.length <= 1) return { result: arr, steps: [] }

    const steps: string[] = []
    const result = [...arr] // Копируем массив
    const stack: [number, number][] = [[0, result.length - 1]]

    steps.push(`Начальный массив: [${result.join(", ")}]`)

    while (stack.length > 0) {
      const [low, high] = stack.pop()!

      if (low < high) {
        // Разделение массива
        const pivotIndex = partition(result, low, high, steps)

        // Добавляем подмассивы в стек
        stack.push([low, pivotIndex - 1])
        stack.push([pivotIndex + 1, high])

        steps.push(`Стек операций: ${stack.map(([l, h]) => `[${l}-${h}]`).join(", ")}`)
      }
    }

    return { result, steps }
  }

  // Функция разделения для итерационной сортировки
  function partition(arr: number[], low: number, high: number, steps: string[]): number {
    const pivot = arr[high] // Берем последний элемент как опорный
    steps.push(`Разделение массива от ${low} до ${high}, опорный элемент: ${pivot}`)

    let i = low - 1

    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]] // Обмен элементов
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    steps.push(`После разделения: [${arr.join(", ")}], позиция опорного: ${i + 1}`)

    return i + 1
  }

  const handleSort = () => {
    try {
      const numbers = inputArray
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num))

      if (numbers.length === 0) {
        alert("Пожалуйста, введите корректные числа")
        return
      }

      // Рекурсивная сортировка
      const recursiveStepsArray: string[] = []
      const recursiveSorted = quickSortRecursive([...numbers], recursiveStepsArray)
      setRecursiveResult(recursiveSorted)
      setRecursiveSteps(recursiveStepsArray)

      // Итерационная сортировка
      const { result: iterativeSorted, steps: iterativeStepsArray } = quickSortIterative([...numbers])
      setIterativeResult(iterativeSorted)
      setIterativeSteps(iterativeStepsArray)
    } catch (error) {
      alert("Ошибка при сортировке. Проверьте введенные данные.")
    }
  }

  const generateRandomArray = () => {
    const randomNumbers = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100))
    setInputArray(randomNumbers.join(", "))
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Быстрая сортировка (Quicksort)</h1>
        <p className="text-muted-foreground">Реализация рекурсивного и итерационного подходов</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ввод данных</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="array-input">Введите числа через запятую:</Label>
            <Input
              id="array-input"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              placeholder="64, 34, 25, 12, 22, 11, 90"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSort}>Сортировать</Button>
            <Button variant="outline" onClick={generateRandomArray}>
              Случайный массив
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Рекурсивная сортировка */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Рекурсивный подход</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Результат:</Label>
                <div className="p-3 bg-muted rounded-md font-mono">[{recursiveResult.join(", ")}]</div>
              </div>

              {recursiveSteps.length > 0 && (
                <div>
                  <Label className="font-semibold">Шаги выполнения:</Label>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {recursiveSteps.map((step, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded text-muted-foreground">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Итерационная сортировка */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Итерационный подход</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Результат:</Label>
                <div className="p-3 bg-muted rounded-md font-mono">[{iterativeResult.join(", ")}]</div>
              </div>

              {iterativeSteps.length > 0 && (
                <div>
                  <Label className="font-semibold">Шаги выполнения:</Label>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {iterativeSteps.map((step, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded text-muted-foreground">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Описание алгоритмов */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Рекурсивный подход</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Принцип работы:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Выбираем опорный элемент (средний)</li>
              <li>Делим массив на два подмассива</li>
              <li>Рекурсивно сортируем каждый подмассив</li>
              <li>Объединяем результаты</li>
            </ul>
            <p className="mt-3">
              <strong>Сложность:</strong> O(n log n) в среднем, O(n²) в худшем случае
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Итерационный подход</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Принцип работы:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Используем стек для хранения границ подмассивов</li>
              <li>Разделяем массив на месте</li>
              <li>Добавляем новые границы в стек</li>
              <li>Продолжаем до опустошения стека</li>
            </ul>
            <p className="mt-3">
              <strong>Преимущество:</strong> Избегает переполнения стека вызовов
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
