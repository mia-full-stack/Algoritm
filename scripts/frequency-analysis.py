import string
from collections import Counter
import matplotlib.pyplot as plt

class FrequencyAnalyzer:
    """
    Класс для анализа частоты букв в тексте
    """
    
    def __init__(self, language='english'):
        self.language = language
        
        # Определяем алфавиты для разных языков
        self.alphabets = {
            'english': string.ascii_lowercase,
            'german': string.ascii_lowercase + 'äöüß'
        }
        
        # Ожидаемые частоты для разных языков (в процентах)
        self.expected_frequencies = {
            'english': {
                'e': 12.7, 't': 9.1, 'a': 8.2, 'o': 7.5, 'i': 7.0, 'n': 6.7,
                's': 6.3, 'h': 6.1, 'r': 6.0, 'd': 4.3, 'l': 4.0, 'c': 2.8,
                'u': 2.8, 'm': 2.4, 'w': 2.4, 'f': 2.2, 'g': 2.0, 'y': 2.0,
                'p': 1.9, 'b': 1.3, 'v': 1.0, 'k': 0.8, 'j': 0.15, 'x': 0.15,
                'q': 0.10, 'z': 0.07
            },
            'german': {
                'e': 17.4, 'n': 9.8, 'i': 7.5, 's': 7.3, 'r': 7.0, 'a': 6.5,
                't': 6.2, 'd': 5.1, 'h': 4.8, 'u': 4.4, 'l': 3.4, 'c': 3.1,
                'g': 3.0, 'm': 2.5, 'o': 2.5, 'b': 1.9, 'w': 1.9, 'f': 1.7,
                'k': 1.2, 'z': 1.1, 'p': 0.8, 'v': 0.7, 'ü': 0.6, 'ä': 0.5,
                'j': 0.3, 'ö': 0.3, 'y': 0.04, 'x': 0.03, 'q': 0.02, 'ß': 0.3
            }
        }
    
    def analyze_text(self, text):
        """
        Анализирует частоту букв в тексте
        
        Args:
            text (str): Текст для анализа
            
        Returns:
            dict: Словарь с результатами анализа
        """
        # Приводим к нижнему регистру
        text = text.lower()
        
        # Фильтруем только буквы нужного алфавита
        alphabet = self.alphabets[self.language]
        filtered_letters = [char for char in text if char in alphabet]
        
        # Подсчитываем частоты
        letter_counts = Counter(filtered_letters)
        total_letters = len(filtered_letters)
        
        # Создаем частотный словарь
        frequency_dict = {}
        for letter in alphabet:
            count = letter_counts.get(letter, 0)
            frequency = (count / total_letters * 100) if total_letters > 0 else 0
            frequency_dict[letter] = {
                'count': count,
                'frequency': frequency,
                'percentage': f"{frequency:.2f}%"
            }
        
        return {
            'frequencies': frequency_dict,
            'total_letters': total_letters,
            'unique_letters': len([l for l in frequency_dict.values() if l['count'] > 0]),
            'sorted_by_frequency': sorted(
                frequency_dict.items(), 
                key=lambda x: x[1]['frequency'], 
                reverse=True
            )
        }
    
    def print_frequency_table(self, analysis_result):
        """
        Выводит таблицу частот в консоль
        """
        print(f"\n=== ЧАСТОТНЫЙ СЛОВАРЬ ({self.language.upper()}) ===")
        print(f"Всего букв: {analysis_result['total_letters']}")
        print(f"Уникальных букв: {analysis_result['unique_letters']}")
        print("\nБуква | Количество | Частота | Ожидаемая")
        print("-" * 45)
        
        for letter, data in analysis_result['sorted_by_frequency']:
            if data['count'] > 0:
                expected = self.expected_frequencies[self.language].get(letter, 0)
                print(f"  {letter.upper()}   |     {data['count']:3d}    | {data['percentage']:>6} | {expected:>6.1f}%")
    
    def compare_with_expected(self, analysis_result):
        """
        Сравнивает полученные частоты с ожидаемыми
        """
        print(f"\n=== СРАВНЕНИЕ С ОЖИДАЕМЫМИ ЧАСТОТАМИ ===")
        differences = []
        
        for letter, data in analysis_result['frequencies'].items():
            if data['count'] > 0:
                expected = self.expected_frequencies[self.language].get(letter, 0)
                actual = data['frequency']
                diff = abs(actual - expected)
                differences.append((letter, actual, expected, diff))
        
        # Сортируем по разности
        differences.sort(key=lambda x: x[3], reverse=True)
        
        print("Буква | Фактическая | Ожидаемая | Разность")
        print("-" * 45)
        for letter, actual, expected, diff in differences[:10]:  # Топ-10 различий
            print(f"  {letter.upper()}   |   {actual:6.2f}%   |  {expected:6.1f}%  | {diff:6.2f}%")


def main():
    # Примеры текстов
    english_text = """
    The quick brown fox jumps over the lazy dog. This pangram contains every letter 
    of the English alphabet at least once. It is commonly used for testing typewriters, 
    computer keyboards, and display fonts. The phrase has been used since at least 
    the late 19th century and was widely known by the 1930s.
    """
    
    german_text = """
    Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Dieser deutsche 
    Pangrammsatz enthält alle Buchstaben des deutschen Alphabets. Die deutsche Sprache 
    verwendet zusätzlich zu den lateinischen Buchstaben auch Umlaute wie ä, ö, ü und 
    das Eszett ß. Diese Besonderheiten machen die Frequenzanalyse interessant.
    """
    
    # Анализ английского текста
    print("АНАЛИЗ АНГЛИЙСКОГО ТЕКСТА")
    print("=" * 50)
    english_analyzer = FrequencyAnalyzer('english')
    english_result = english_analyzer.analyze_text(english_text)
    english_analyzer.print_frequency_table(english_result)
    english_analyzer.compare_with_expected(english_result)
    
    # Анализ немецкого текста
    print("\n\nАНАЛИЗ НЕМЕЦКОГО ТЕКСТА")
    print("=" * 50)
    german_analyzer = FrequencyAnalyzer('german')
    german_result = german_analyzer.analyze_text(german_text)
    german_analyzer.print_frequency_table(german_result)
    german_analyzer.compare_with_expected(german_result)


if __name__ == "__main__":
    main()
