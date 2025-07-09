"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface LetterFrequency {
  letter: string
  count: number
  frequency: number
  percentage: string
}

interface LanguageData {
  name: string
  alphabet: string[]
  sampleText: string
  expectedFrequencies: Record<string, number>
}

const languages: Record<string, LanguageData> = {
  english: {
    name: "Английский",
    alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
    sampleText: `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. It is commonly used for testing typewriters, computer keyboards, and display fonts. The phrase has been used since at least the late 19th century and was widely known by the 1930s.`,
    expectedFrequencies: {
      e: 12.7,
      t: 9.1,
      a: 8.2,
      o: 7.5,
      i: 7.0,
      n: 6.7,
      s: 6.3,
      h: 6.1,
      r: 6.0,
      d: 4.3,
      l: 4.0,
      c: 2.8,
      u: 2.8,
      m: 2.4,
      w: 2.4,
      f: 2.2,
      g: 2.0,
      y: 2.0,
      p: 1.9,
      b: 1.3,
      v: 1.0,
      k: 0.8,
      j: 0.15,
      x: 0.15,
      q: 0.1,
      z: 0.07,
    },
  },
  german: {
    name: "Немецкий",
    alphabet: "abcdefghijklmnopqrstuvwxyzäöüß".split(""),
    sampleText: `Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Dieser deutsche Pangrammsatz enthält alle Buchstaben des deutschen Alphabets. Die deutsche Sprache verwendet zusätzlich zu den lateinischen Buchstaben auch Umlaute wie ä, ö, ü und das Eszett ß. Diese Besonderheiten machen die Frequenzanalyse interessant.`,
    expectedFrequencies: {
      e: 17.4,
      n: 9.8,
      i: 7.5,
      s: 7.3,
      r: 7.0,
      a: 6.5,
      t: 6.2,
      d: 5.1,
      h: 4.8,
      u: 4.4,
      l: 3.4,
      c: 3.1,
      g: 3.0,
      m: 2.5,
      o: 2.5,
      b: 1.9,
      w: 1.9,
      f: 1.7,
      k: 1.2,
      z: 1.1,
      p: 0.8,
      v: 0.7,
      ü: 0.6,
      ä: 0.5,
      j: 0.3,
      ö: 0.3,
      y: 0.04,
      x: 0.03,
      q: 0.02,
      ß: 0.3,
    },
  },
}

export default function Component() {
  const [inputText, setInputText] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english")
  const [showComparison, setShowComparison] = useState(false)

  const currentLanguage = languages[selectedLanguage]

  const frequencyData = useMemo(() => {
    if (!inputText.trim()) return []

    const text = inputText.toLowerCase()
    const letterCounts: Record<string, number> = {}
    let totalLetters = 0

    // Подсчитываем только буквы выбранного алфавита
    for (const char of text) {
      if (currentLanguage.alphabet.includes(char)) {
        letterCounts[char] = (letterCounts[char] || 0) + 1
        totalLetters++
      }
    }

    // Создаем массив с данными о частоте
    const frequencies: LetterFrequency[] = currentLanguage.alphabet.map((letter) => {
      const count = letterCounts[letter] || 0
      const frequency = totalLetters > 0 ? (count / totalLetters) * 100 : 0
      return {
        letter: letter.toUpperCase(),
        count,
        frequency,
        percentage: frequency.toFixed(2),
      }
    })

    // Сортируем по частоте (убывание)
    return frequencies.sort((a, b) => b.frequency - a.frequency)
  }, [inputText, currentLanguage])

  const loadSampleText = () => {
    setInputText(currentLanguage.sampleText)
  }

  const clearText = () => {
    setInputText("")
  }

  const totalLetters = frequencyData.reduce((sum, item) => sum + item.count, 0)
  const maxFrequency = frequencyData.length > 0 ? frequencyData[0].frequency : 0

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Частотный словарь букв</h1>
        <p className="text-muted-foreground">
          Анализ частоты встречаемости букв в тексте для английского и немецкого языков
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Панель ввода */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Настройки анализа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language-select">Язык:</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages).map(([key, lang]) => (
                      <SelectItem key={key} value={key}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="text-input">Введите текст для анализа:</Label>
                <Textarea
                  id="text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Введите текст на ${currentLanguage.name.toLowerCase()} языке...`}
                  className="min-h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={loadSampleText} variant="outline" size="sm">
                  Пример текста
                </Button>
                <Button onClick={clearText} variant="outline" size="sm">
                  Очистить
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-comparison"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                />
                <Label htmlFor="show-comparison" className="text-sm">
                  Сравнить с ожидаемыми частотами
                </Label>
              </div>

              {totalLetters > 0 && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <strong>Всего букв:</strong> {totalLetters}
                  </p>
                  <p className="text-sm">
                    <strong>Уникальных букв:</strong> {frequencyData.filter((f) => f.count > 0).length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Результаты анализа */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Таблица частот</TabsTrigger>
              <TabsTrigger value="chart">Визуализация</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Частотный словарь</CardTitle>
                </CardHeader>
                <CardContent>
                  {frequencyData.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {frequencyData.map((item, index) => (
                        <div
                          key={item.letter}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 flex items-center justify-center font-mono">
                              {item.letter}
                            </Badge>
                            <div>
                              <p className="font-medium">
                                {item.count} раз ({item.percentage}%)
                              </p>
                              {showComparison && currentLanguage.expectedFrequencies[item.letter.toLowerCase()] && (
                                <p className="text-xs text-muted-foreground">
                                  Ожидаемо: {currentLanguage.expectedFrequencies[item.letter.toLowerCase()]}%
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress value={(item.frequency / maxFrequency) * 100} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Введите текст для анализа частоты букв</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Графическое представление</CardTitle>
                </CardHeader>
                <CardContent>
                  {frequencyData.length > 0 ? (
                    <div className="space-y-1">
                      {frequencyData
                        .filter((item) => item.count > 0)
                        .map((item) => (
                          <div key={item.letter} className="flex items-center gap-3">
                            <div className="w-8 text-center font-mono font-bold">{item.letter}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${(item.frequency / maxFrequency) * 100}%` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                    {item.percentage}%
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground w-12 text-right">{item.count}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Введите текст для отображения графика</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Информация об алгоритме */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>О частотном анализе</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Что такое частотный словарь?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Частотный словарь букв — это структура данных, которая содержит информацию о том, как часто каждая буква
              алфавита встречается в тексте. Это важный инструмент в:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Криптографии и криптоанализе</li>
              <li>• Сжатии данных (алгоритм Хаффмана)</li>
              <li>• Лингвистических исследованиях</li>
              <li>• Распознавании языка текста</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Особенности языков</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Английский язык:</p>
                <p className="text-xs text-muted-foreground">Самые частые: E, T, A, O, I, N, S, H, R</p>
              </div>
              <div>
                <p className="text-sm font-medium">Немецкий язык:</p>
                <p className="text-xs text-muted-foreground">Самые частые: E, N, I, S, R, A, T, D, H</p>
                <p className="text-xs text-muted-foreground">Дополнительные символы: Ä, Ö, Ü, ß</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
