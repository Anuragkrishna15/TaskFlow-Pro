class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }

    initializeElements() {
        this.taskForm = document.getElementById('taskForm');
        this.taskList = document.getElementById('taskList');
        this.taskModal = document.getElementById('taskModal');
        this.filterModal = document.getElementById('filterModal');
    }

    bindEvents() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openModal(this.taskModal));
        document.getElementById('filterBtn').addEventListener('click', () => this.openModal(this.filterModal));
        this.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        const task = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            dueDate: document.getElementById('taskDueDate').value,
            priority: document.getElementById('taskPriority').value,
            category: document.getElementById('taskCategory').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.updateUI();
        this.closeModals();
        this.taskForm.reset();
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.status}`;
        taskElement.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(task.dueDate).toLocaleDateString()}</span>
                    <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    <span><i class="fas fa-tag"></i> ${task.category}</span>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            </div>
            <div class="task-actions">
                <button onclick="taskManager.toggleTaskStatus('${task.id}')" class="btn-secondary">
                    <i class="fas ${task.status === 'completed' ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="taskManager.editTask('${task.id}')" class="btn-secondary">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="taskManager.deleteTask('${task.id}')" class="btn-secondary">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return taskElement;
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id == taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            this.saveTasks();
            this.updateUI();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id == taskId);
        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskCategory').value = task.category;
            
            this.tasks = this.tasks.filter(t => t.id != taskId);
            this.openModal(this.taskModal);
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id != taskId);
            this.saveTasks();
            this.updateUI();
        }
    }

    updateUI() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            this.taskList.appendChild(this.createTaskElement(task));
        });
    }

    openModal(modal) {
        modal.style.display = 'block';
    }

    closeModals() {
        this.taskModal.style.display = 'none';
        this.filterModal.style.display = 'none';
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();

// Close modals when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        taskManager.closeModals();
    }
}; 