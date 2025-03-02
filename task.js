document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    const taskWorkload = document.getElementById('taskWorkload').value;
    const taskType = document.getElementById('taskType').value;

    // Validate inputs
    if (!taskName || !taskDeadline || !taskWorkload || !taskType) {
        alert('Please fill in all fields!');
        return;
    }

    // Create a task object
    const task = {
        id: Date.now(),
        name: taskName,
        deadline: taskDeadline,
        workload: taskWorkload,
        type: taskType,
        completed: false, // Default to incomplete
    };
    // Save the task to localStorage
    saveTaskToLocalStorage(task);

    // Reload tasks to update the UI
    loadTasks();

    // Clear input fields
    clearInputs();
}

function saveTaskToLocalStorage(task) {
    try {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save task to localStorage:', error);
        alert('Failed to save task. Please try again.');
    }
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = prioritizeTasks(tasks); // Prioritize tasks
    renderTasks(tasks); // Render tasks in the UI
}

function prioritizeTasks(tasks) {
    // Sort by urgency (deadline) and difficulty (workload)
    return tasks.sort((a, b) => {
        const urgencyA = new Date(a.deadline).getTime(); // Convert deadline to timestamp
        const urgencyB = new Date(b.deadline).getTime();

        if (urgencyA !== urgencyB) {
            return urgencyA - urgencyB; // Sooner deadlines first
        } else {
            return b.workload - a.workload; // Higher workload first if deadlines are the same
        }
    });
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the list before rendering

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.taskId = task.id;

        taskItem.innerHTML = `
        <span><strong>${task.name}</strong></span>
        <span>Type: ${task.type}</span>
        <span>Deadline: ${new Date(task.deadline).toLocaleString()}</span>
        <span>Difficulty: ${getWorkloadText(task.workload)}</span>
        <button class="marker" onclick="toggleTaskCompletion(${task.id})">
            ${task.completed ? 'Undo' : 'Mark as Done'}
        </button>
        <button onclick="removeTask(this)">Delete</button>
    `;

        taskList.appendChild(taskItem);
    });
}

function removeTask(button) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    const taskItem = button.parentElement;
    const taskId = taskItem.dataset.taskId;

    removeTaskFromLocalStorage(taskId);
    loadTasks(); // Reload tasks after deletion
}

function removeTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== Number(taskId));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getWorkloadText(workloadValue) {
    switch (workloadValue) {
        case '1':
            return 'Low';
        case '2':
            return 'Medium';
        case '3':
            return 'High';
        default:
            return 'Unknown';
    }
}

function clearInputs() {
    document.getElementById('taskName').value = '';
    document.getElementById('taskDeadline').value = '';
    document.getElementById('taskWorkload').value = '1'; // Reset to default
    document.getElementById('taskType').value = 'essay'; // Reset to default
}

