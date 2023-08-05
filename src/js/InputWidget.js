export default class InputWidget {
  constructor(inputElement) {
    if (typeof inputElement === 'string') { // Проверка на тип элемента, для дальнейшей передачи селекторов, либо существующих элементов DOM
      inputElement = document.querySelector(inputElement);
    }

    this.inputElement = inputElement;
    this.inputField = document.querySelector('.task-input');
    this.inputField.addEventListener('keydown', this.onInput.bind(this)); // Поле ввода подписываем на событие keydown
    this.inputField.addEventListener('input', this.onInputFilter.bind(this)); // Поле ввода подписываем на событие input (для фильтрации)
  }

  onInput(e) { // Событие ввода в поле ввода
    if (e.key === 'Enter') { // Код клавиши Enter
      e.preventDefault();

      if (this.inputField.value === '') { // Если поле ввода пустое, выводим ошибку
        throw new Error('Ошибка: поле ввода пустое! Заполните его');
      }

      const taskList = document.querySelector('.task-list');
      const taskListText = taskList.querySelector('.task-list_text'); // Находим текст и удаляем его
      if (taskListText) {
        taskList.removeChild(taskListText);
      }
      const taskItem = document.createElement('div'); // Создаем элемент задачи
      taskItem.classList.add('task-item');

      const taskItemText = document.createElement('div'); // Добавляем к нему текст задачи
      taskItemText.classList.add('task-item_text');
      taskItemText.textContent = this.inputField.value;

      const checkboxButton = document.createElement('input'); // Добавляем к нему радио-кнопку
      checkboxButton.type = 'checkbox';
      checkboxButton.name = 'task-checkbox';
      checkboxButton.classList.add('task-checkbox');
      checkboxButton.addEventListener('change', this.onChange.bind(this));

      taskItem.appendChild(taskItemText); // Добавляем все к элементу задачи
      taskItem.appendChild(checkboxButton);
      taskList.appendChild(taskItem);

      this.inputField.value = ''; // Очистить поле ввода после добавления задачи

      const allTasks = document.querySelectorAll('.task-item');
      allTasks.forEach((item) => { // Показываем все задачи после фильтрации и добавления новой задачи
        item.style.display = 'flex';
      });
    }
  }

  onChange(e) { // Событие изменения состояния радио-кнопки
    const taskItem = e.target.closest('.task-item');
    const taskList = document.querySelector('.task-list');
    const pinnedTaskList = document.querySelector('.task-list_pinned');

    if (e.target.checked) { // Если нажата в списке задач, то добавляем задачу в закрепленный список
      taskItem.classList.add('task-item_pinned');
      pinnedTaskList.appendChild(taskItem);
    } else { // Если нажата в закрепленном списке, то удалаяем из закрепленного списка
      taskItem.classList.remove('task-item_pinned');
      taskList.appendChild(taskItem);
    }

    this.checkPinnedTasks();
  }

  onInputFilter() { // Фильтрация задач в списке задач
    const searchText = this.inputField.value.toLowerCase();
    const allTasks = document.querySelectorAll('.task-item');
    const taskList = document.querySelector('.task-list');
    let taskNotFound = true;

    allTasks.forEach((taskItem) => {
      if (taskItem.classList.contains('task-item_pinned')) {
        return;
      }

      const taskItemText = taskItem.querySelector('.task-item_text').textContent.toLowerCase();

      if (taskItemText.startsWith(searchText)) {
        taskItem.style.display = 'flex';
        taskNotFound = false;
      } else {
        taskItem.style.display = 'none';
      }
    });

    const taskListText = taskList.querySelector('.task-list_text');

    if (taskNotFound) {
      if (!taskListText) {
        const newTaskListText = document.createElement('div');
        newTaskListText.classList.add('task-list_text');
        newTaskListText.textContent = 'No tasks found';
        taskList.appendChild(newTaskListText);
      } else if (taskList.length === 0) {
        taskList.removeChild(taskListText);
      }
    } else if (taskListText) {
      taskList.removeChild(taskListText);
    }
  }

  checkPinnedTasks() { // Проверка на наличие закрепленных задач
    const pinnedTaskList = document.querySelector('.task-list_pinned');
    const taskItems = pinnedTaskList.querySelectorAll('.task-item_pinned');
    const taskItemTextPinned = pinnedTaskList.querySelector('.task-text_pinned');

    if (taskItems.length === 0) { // Если задачи нет, то показывает текст 'No pinned tasks'
      if (!taskItemTextPinned) {
        const pinnedtaskItemText = document.createElement('div');
        pinnedtaskItemText.classList.add('task-text_pinned');
        pinnedtaskItemText.textContent = 'No pinned tasks';
        pinnedTaskList.appendChild(pinnedtaskItemText);
      }
    } else { // Если хотя бы 1 задача есть, то удаляем текс 'No pinned tasks'
      if (taskItemTextPinned) {
        pinnedTaskList.removeChild(taskItemTextPinned);
      }
    }
  }
}
