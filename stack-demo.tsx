"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

class Stack<T> {
  private items: T[]
  private maxSize: number

  constructor(maxSize = 100) {
    this.items = []
    this.maxSize = maxSize
  }

  // Проверка стека на пустоту
  empty(): boolean {
    return this.items.length === 0
  }

  // Проверка на переполнение
  isFull(): boolean {
    return this.items.length >= this.maxSize
  }

  // Добавление элемента в стек
  push(element: T): boolean {
    if (this.isFull()) {
      return false // Стек переполнен
    }
    this.items.push(element)
    return true
  }

  // Удаление и возврат верхнего элемента
  pop(): T | null {
    if (this.empty()) {
      return null // Стек пуст
    }
    return this.items.pop()!
  }

  // Просмотр верхнего элемента без удаления
  peek(): T | null {
    if (this.empty()) {
      return null
    }
    return this.items[this.items.length - 1]
  }

  // Поиск элемента и возврат позиции от вершины
  search(element: T): number {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i] === element) {
        return this.items.length - 1 - i // Позиция от вершины (0-based)
      }
    }
    return -1 // Элемент не найден
  }

  // Получение размера стека
  size(): number {
    return this.items.length
  }

  // Получение всех элементов (для отображения)
  getItems(): T[] {
    return [...this.items]
  }

  // Очистка стека
  clear(): void {
    this.items = []
  }
}

interface StackOperation {
  operation: string
  element?: string
  result: string
  stackState: string[]
  timestamp: string
}

export default function Component() {
  const [stack] = useState(() => new Stack<string>(10))
  const [inputValue, setInputValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [operations, setOperations] = useState<StackOperation[]>([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const operationsEndRef = useRef<HTMLDivElement>(null)

  const addOperation = (operation: string, element?: string, result?: string) => {
    const newOperation: StackOperation = {
      operation,
      element,
      result: result || "",
      stackState: stack.getItems(),
      timestamp: new Date().toLocaleTimeString(),
    }
    setOperations((prev) => [...prev, newOperation])
  }

  const showMessage = (msg: string, type: "success" | "error" | "info" = "info") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  const handlePush = () => {
    if (!inputValue.trim()) {
      showMessage("Введите значение для добавления", "error")
      return
    }

    if (stack.push(inputValue.trim())) {
      addOperation("push", inputValue.trim(), "Элемент добавлен")
      showMessage(`Элемент "${inputValue.trim()}" добавлен в стек`, "success")
      setInputValue("")
    } else {
      showMessage("Стек переполнен! Максимальный размер: 10", "error")
    }
  }

  const handlePop = () => {
    const poppedElement = stack.pop()
    if (poppedElement !== null) {
      addOperation("pop", undefined, `Удален: ${poppedElement}`)
      showMessage(`Элемент "${poppedElement}" удален из стека`, "success")
    } else {
      showMessage("Стек пуст! Нечего удалять", "error")
    }
  }

  const handlePeek = () => {
    const topElement = stack.peek()
    if (topElement !== null) {
      addOperation("peek", undefined, `Верхний элемент: ${topElement}`)
      showMessage(`Верхний элемент: "${topElement}"`, "info")
    } else {
      showMessage("Стек пуст!", "error")
    }
  }

  const handleSearch = () => {
    if (!searchValue.trim()) {
      showMessage("Введите значение для поиска", "error")
      return
    }

    const position = stack.search(searchValue.trim())
    if (position !== -1) {
      addOperation("search", searchValue.trim(), `Найден на позиции: ${position}`)
      showMessage(`Элемент "${searchValue.trim()}" найден на позиции ${position} от вершины`, "success")
    } else {
      addOperation("search", searchValue.trim(), "Не найден")
      showMessage(`Элемент "${searchValue.trim()}" не найден в стеке`, "error")
    }
    setSearchValue("")
  }

  const handleEmpty = () => {
    const isEmpty = stack.empty()
    addOperation("empty", undefined, isEmpty ? "Стек пуст" : "Стек не пуст")
    showMessage(isEmpty ? "Стек пуст" : "Стек содержит элементы", "info")
  }

  const handleClear = () => {
    stack.clear()
    addOperation("clear", undefined, "Стек очищен")
    showMessage("Стек очищен", "success")
  }

  const loadExample = () => {
    stack.clear()
    const examples = ["HTML", "CSS", "JavaScript", "React", "Node.js"]
    examples.forEach((item) => stack.push(item))
    addOperation("load_example", undefined, "Загружен пример")
    showMessage("Загружен пример стека", "success")
  }

  useEffect(() => {
    operationsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [operations])

  const stackItems = stack.getItems()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Структура данных: Стек (Stack)</h1>
        <p className="text-muted-foreground">Реализация стека на основе массива с операциями LIFO</p>
      </div>

      {message && (
        <Alert
          className={`mb-4 ${messageType === "error" ? "border-red-500" : messageType === "success" ? "border-green-500" : "border-blue-500"}`}
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Панель управления */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Операции со стеком</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="push-input">Push - добавить элемент:</Label>
                <div className="flex gap-2">
                  <Input
                    id="push-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Введите значение"
                    onKeyPress={(e) => e.key === "Enter" && handlePush()}
                  />
                  <Button onClick={handlePush} disabled={stack.isFull()}>
                    Push
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handlePop}
                  disabled={stack.empty()}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Pop
                </Button>
                <Button
                  onClick={handlePeek}
                  disabled={stack.empty()}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Peek
                </Button>
              </div>

              <div>
                <Label htmlFor="search-input">Search - найти элемент:</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Поиск элемента"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} variant="outline">
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEmpty} variant="outline" className="flex-1 bg-transparent">
                  Empty?
                </Button>
                <Button onClick={handleClear} variant="destructive" className="flex-1">
                  Clear
                </Button>
              </div>

              <Separator />

              <Button onClick={loadExample} variant="secondary" className="w-full">
                Загрузить пример
              </Button>

              <div className="p-3 bg-muted rounded-md text-sm">
                <p>
                  <strong>Размер:</strong> {stack.size()}/10
                </p>
                <p>
                  <strong>Статус:</strong> {stack.empty() ? "Пуст" : stack.isFull() ? "Переполнен" : "Активен"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Визуализация и история */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualization">Визуализация стека</TabsTrigger>
              <TabsTrigger value="history">История операций</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization">
              <Card>
                <CardHeader>
                  <CardTitle>Состояние стека</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-muted-foreground mb-4">
                      ← Вершина стека (Top) | LIFO: Last In, First Out →
                    </div>

                    {stackItems.length === 0 ? (
                      <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center text-muted-foreground">
                        Стек пуст
                        <br />
                        <span className="text-xs">Добавьте элементы с помощью операции Push</span>
                      </div>
                    ) : (
                      <div className="space-y-2 w-full max-w-md">
                        {stackItems
                          .slice()
                          .reverse()
                          .map((item, index) => (
                            <div
                              key={`${item}-${stackItems.length - 1 - index}`}
                              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                                index === 0 ? "border-primary bg-primary/10 shadow-md" : "border-muted bg-muted/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-medium">{item}</span>
                                <div className="flex items-center gap-2">
                                  {index === 0 && <Badge variant="default">TOP</Badge>}
                                  <Badge variant="outline">pos: {index}</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="mt-4 text-xs text-muted-foreground text-center">
                      Позиции отсчитываются от вершины стека (0 = верхний элемент)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>История операций</CardTitle>
                </CardHeader>
                <CardContent>
                  {operations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">История операций пуста</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {operations.map((op, index) => (
                        <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{op.operation}</Badge>
                              {op.element && <span className="font-mono text-sm">"{op.element}"</span>}
                            </div>
                            <span className="text-xs text-muted-foreground">{op.timestamp}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{op.result}</div>
                          <div className="text-xs">
                            <strong>Состояние стека:</strong> [{op.stackState.join(", ")}]
                          </div>
                        </div>
                      ))}
                      <div ref={operationsEndRef} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Описание операций */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Описание операций стека</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-600">push(element)</h3>
              <p className="text-sm text-muted-foreground">
                Добавляет элемент на вершину стека. Возвращает true при успехе, false при переполнении.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-red-600">pop()</h3>
              <p className="text-sm text-muted-foreground">
                Удаляет и возвращает верхний элемент стека. Возвращает null, если стек пуст.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">peek()</h3>
              <p className="text-sm text-muted-foreground">
                Возвращает верхний элемент стека без его удаления. Возвращает null, если стек пуст.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-purple-600">search(element)</h3>
              <p className="text-sm text-muted-foreground">
                Ищет элемент в стеке. Возвращает позицию от вершины (0-based) или -1, если не найден.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-orange-600">empty()</h3>
              <p className="text-sm text-muted-foreground">
                Проверяет, пуст ли стек. Возвращает true, если стек не содержит элементов.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Принцип LIFO</h3>
              <p className="text-sm text-muted-foreground">
                Last In, First Out - последний добавленный элемент удаляется первым.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
