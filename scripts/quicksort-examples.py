def quicksort_recursive(arr):
    """
    Рекурсивная реализация быстрой сортировки
    """
    if len(arr) <= 1:
        return arr
    
    # Выбираем опорный элемент (средний)
    pivot_index = len(arr) // 2
    pivot = arr[pivot_index]
    
    print(f"Опорный элемент: {pivot}, массив: {arr}")
    
    # Делим массив на подмассивы
    left = [x for i, x in enumerate(arr) if i != pivot_index and x < pivot]
    right = [x for i, x in enumerate(arr) if i != pivot_index and x >= pivot]
    
    print(f"Левый: {left}, Правый: {right}")
    
    # Рекурсивно сортируем и объединяем
    return quicksort_recursive(left) + [pivot] + quicksort_recursive(right)


def quicksort_iterative(arr):
    """
    Итерационная реализация быстрой сортировки
    """
    if len(arr) <= 1:
        return arr
    
    result = arr.copy()
    stack = [(0, len(result) - 1)]
    
    print(f"Начальный массив: {result}")
    
    while stack:
        low, high = stack.pop()
        
        if low < high:
            # Разделение массива
            pivot_index = partition(result, low, high)
            
            # Добавляем подмассивы в стек
            stack.append((low, pivot_index - 1))
            stack.append((pivot_index + 1, high))
            
            print(f"Стек: {stack}")
    
    return result


def partition(arr, low, high):
    """
    Функция разделения для итерационной сортировки
    """
    pivot = arr[high]  # Берем последний элемент как опорный
    print(f"Разделение от {low} до {high}, опорный: {pivot}")
    
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    print(f"После разделения: {arr}")
    
    return i + 1


# Тестирование алгоритмов
if __name__ == "__main__":
    test_array = [64, 34, 25, 12, 22, 11, 90]
    
    print("=== РЕКУРСИВНАЯ СОРТИРОВКА ===")
    recursive_result = quicksort_recursive(test_array.copy())
    print(f"Результат: {recursive_result}")
    
    print("\n=== ИТЕРАЦИОННАЯ СОРТИРОВКА ===")
    iterative_result = quicksort_iterative(test_array.copy())
    print(f"Результат: {iterative_result}")
    
    print(f"\nОба результата одинаковы: {recursive_result == iterative_result}")
