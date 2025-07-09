class Stack:
    """
    Реализация структуры данных Стек на основе массива
    """
    
    def __init__(self, max_size=100):
        """
        Инициализация стека
        
        Args:
            max_size (int): Максимальный размер стека
        """
        self.items = []
        self.max_size = max_size
    
    def empty(self):
        """
        Проверка стека на наличие в нем элементов
        
        Returns:
            bool: True если стек пуст, False в противном случае
        """
        return len(self.items) == 0
    
    def is_full(self):
        """
        Проверка стека на переполнение
        
        Returns:
            bool: True если стек переполнен, False в противном случае
        """
        return len(self.items) >= self.max_size
    
    def push(self, element):
        """
        Операция вставки нового элемента
        
        Args:
            element: Элемент для добавления в стек
            
        Returns:
            bool: True если элемент добавлен, False если стек переполнен
        """
        if self.is_full():
            print(f"Ошибка: Стек переполнен! Максимальный размер: {self.max_size}")
            return False
        
        self.items.append(element)
        print(f"Элемент '{element}' добавлен в стек")
        return True
    
    def pop(self):
        """
        Операция удаления элемента с вершины стека
        
        Returns:
            Удаленный элемент или None если стек пуст
        """
        if self.empty():
            print("Ошибка: Стек пуст! Нечего удалять")
            return None
        
        element = self.items.pop()
        print(f"Элемент '{element}' удален из стека")
        return element
    
    def peek(self):
        """
        Возвращает элемент с вершины стека, но не удаляет его
        
        Returns:
            Верхний элемент стека или None если стек пуст
        """
        if self.empty():
            print("Ошибка: Стек пуст!")
            return None
        
        top_element = self.items[-1]
        print(f"Верхний элемент стека: '{top_element}'")
        return top_element
    
    def search(self, element):
        """
        Определяет, существует ли объект в стеке
        
        Args:
            element: Элемент для поиска
            
        Returns:
            int: Позицию элемента с вершины стека (0-based) или -1 если не найден
        """
        try:
            # Ищем элемент с конца массива (с вершины стека)
            for i in range(len(self.items) - 1, -1, -1):
                if self.items[i] == element:
                    position = len(self.items) - 1 - i  # Позиция от вершины
                    print(f"Элемент '{element}' найден на позиции {position} от вершины")
                    return position
            
            print(f"Элемент '{element}' не найден в стеке")
            return -1
        except Exception as e:
            print(f"Ошибка при поиске: {e}")
            return -1
    
    def size(self):
        """
        Возвращает текущий размер стека
        
        Returns:
            int: Количество элементов в стеке
        """
        return len(self.items)
    
    def display(self):
        """
        Отображает содержимое стека
        """
        if self.empty():
            print("Стек пуст")
            return
        
        print("Содержимое стека (сверху вниз):")
        for i in range(len(self.items) - 1, -1, -1):
            position = len(self.items) - 1 - i
            marker = " <- TOP" if i == len(self.items) - 1 else ""
            print(f"[{position}] {self.items[i]}{marker}")
    
    def clear(self):
        """
        Очищает стек
        """
        self.items.clear()
        print("Стек очищен")


def demonstrate_stack_operations():
    """
    Демонстрация работы всех операций стека
    """
    print("=== ДЕМОНСТРАЦИЯ РАБОТЫ СТЕКА ===\n")
    
    # Создаем стек с максимальным размером 5
    stack = Stack(max_size=5)
    
    # Проверяем пустой стек
    print("1. Проверка пустого стека:")
    print(f"Стек пуст: {stack.empty()}")
    stack.display()
    print()
    
    # Добавляем элементы
    print("2. Добавление элементов (push):")
    elements_to_add = ["HTML", "CSS", "JavaScript", "React", "Node.js"]
    for element in elements_to_add:
        stack.push(element)
    print()
    
    # Отображаем стек
    print("3. Состояние стека после добавления:")
    stack.display()
    print(f"Размер стека: {stack.size()}")
    print(f"Стек пуст: {stack.empty()}")
    print()
    
    # Пытаемся добавить еще один элемент (переполнение)
    print("4. Попытка переполнения стека:")
    stack.push("Python")
    print()
    
    # Операция peek
    print("5. Просмотр верхнего элемента (peek):")
    top = stack.peek()
    print(f"Верхний элемент: {top}")
    stack.display()
    print()
    
    # Поиск элементов
    print("6. Поиск элементов (search):")
    search_elements = ["React", "CSS", "Python", "HTML"]
    for element in search_elements:
        position = stack.search(element)
        if position != -1:
            print(f"  '{element}' найден на позиции {position}")
        else:
            print(f"  '{element}' не найден")
    print()
    
    # Удаление элементов
    print("7. Удаление элементов (pop):")
    while not stack.empty():
        removed = stack.pop()
        print(f"Текущее состояние стека:")
        stack.display()
        print()
    
    # Попытка удаления из пустого стека
    print("8. Попытка удаления из пустого стека:")
    stack.pop()
    print()
    
    # Попытка peek пустого стека
    print("9. Попытка peek пустого стека:")
    stack.peek()
    print()


def practical_example():
    """
    Практический пример использования стека - проверка скобок
    """
    print("=== ПРАКТИЧЕСКИЙ ПРИМЕР: ПРОВЕРКА СКОБОК ===\n")
    
    def check_brackets(expression):
        """
        Проверяет правильность расстановки скобок в выражении
        """
        stack = Stack()
        opening = "([{"
        closing = ")]}"
        pairs = {"(": ")", "[": "]", "{": "}"}
        
        print(f"Проверяем выражение: {expression}")
        
        for char in expression:
            if char in opening:
                stack.push(char)
                print(f"  Найдена открывающая скобка '{char}', добавляем в стек")
            elif char in closing:
                if stack.empty():
                    print(f"  Найдена закрывающая скобка '{char}', но стек пуст!")
                    return False
                
                top = stack.pop()
                print(f"  Найдена закрывающая скобка '{char}', извлекаем '{top}' из стека")
                
                if pairs[top] != char:
                    print(f"  Несоответствие: '{top}' не соответствует '{char}'")
                    return False
        
        result = stack.empty()
        if result:
            print("  Все скобки правильно расставлены!")
        else:
            print("  Остались неза крытые скобки в стеке")
        
        return result
    
    # Тестируем различные выражения
    test_expressions = [
        "(a + b) * [c - d]",
        "{x + (y * z)}",
        "((a + b)",
        "a + b)",
        "{[()]()}",
        "{[(])}"
    ]
    
    for expr in test_expressions:
        is_valid = check_brackets(expr)
        print(f"Результат: {'✓ Корректно' if is_valid else '✗ Некорректно'}\n")


if __name__ == "__main__":
    # Запускаем демонстрацию
    demonstrate_stack_operations()
    print("\n" + "="*50 + "\n")
    practical_example()
