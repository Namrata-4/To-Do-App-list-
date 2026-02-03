document.addEventListener('DOMContentLoaded', () => {
    const taskInput=document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar=document.getElementById('progress');
    const progressNumbers=document.getElementById('numbers');
    const toggleEmptyState = () => {
        if (!emptyImage) return;
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    }
    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
        progressBar.style.width = `${percent}%`;
        progressNumbers.textContent = `${completedTasks}/${totalTasks}`;
        // Fire confetti once when reaching 100%; reset when below 100%
        if (!updateProgress._fired && percent === 100 && totalTasks > 0) {
            updateProgress._fired = true;
            if (typeof Confetti === 'function') Confetti();
        } else if (percent < 100) {
            updateProgress._fired = false;
        }
    };
    const addTask= (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li=document.createElement('li');
        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" class="checkbox">
                <span>${taskText}</span>
            </div>
            <div class="task-buttons">
                <button class="edit-btn" aria-label="Edit task" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn" aria-label="Delete task" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
        taskInput.value='';
        toggleEmptyState();
   
        setTimeout(() => {
            if (typeof updateEditButtons === 'function') updateEditButtons();
            if (typeof updateProgress === 'function') updateProgress();
        }, 0);
    };
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', addTask);
    } else {
       
        addTaskBtn.addEventListener('click', addTask);
    }

    
    taskList.addEventListener('change', (e) => {
        if (e.target && e.target.matches('.checkbox')) {
            const li = e.target.closest('li');
            if (!li) return;
            const editBtn = li.querySelector('.edit-btn');
            if (e.target.checked) {
                li.classList.add('checked');
                if (editBtn) {
                    editBtn.disabled = true;
                    editBtn.setAttribute('aria-disabled', 'true');
                }
                
                const input = li.querySelector('.edit-input');
                if (input) {
                    const newSpan = document.createElement('span');
                    newSpan.textContent = input.value.trim() || '';
                    input.replaceWith(newSpan);
                }
            } else {
                li.classList.remove('checked');
                if (editBtn) {
                    editBtn.disabled = false;
                    editBtn.removeAttribute('aria-disabled');
                }
            }
       
            if (typeof updateProgress === 'function') updateProgress();
        }
    });

    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
     
        if (e.target.closest('.delete-btn')) {
            li.remove();
            toggleEmptyState();
            if (typeof updateProgress === 'function') updateProgress();
            return;
        }
   
        const editBtnEl = e.target.closest('.edit-btn');
        if (editBtnEl) {
            if (editBtnEl.disabled || li.classList.contains('checked')) return; 
            const span = li.querySelector('span');
            if (!span || li.querySelector('.edit-input')) return; 
            const currentText = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = currentText;
            span.replaceWith(input);
            input.focus();
            const original = currentText;
            const save = () => {
                const newText = input.value.trim() || original;
                const newSpan = document.createElement('span');
                newSpan.textContent = newText;
                input.replaceWith(newSpan);
            };
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') { save(); input.blur(); }
                if (ev.key === 'Escape') { const newSpan = document.createElement('span'); newSpan.textContent = original; input.replaceWith(newSpan); }
            });
            input.addEventListener('blur', save);
            return;
        }
  
        if (e.target.matches('.checkbox')) return;
        const cb = li.querySelector('.checkbox');
        if (cb) {
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change'));
        }
    });

    toggleEmptyState();

    const updateEditButtons = () => {
        const items = taskList.querySelectorAll('li');
        items.forEach(li => {
            const cb = li.querySelector('.checkbox');
            const editBtn = li.querySelector('.edit-btn');
            if (!editBtn) return;
            if (cb && cb.checked) {
                editBtn.disabled = true;
                editBtn.setAttribute('aria-disabled', 'true');
                li.classList.add('checked');
                const input = li.querySelector('.edit-input');
                if (input) {
                    const newSpan = document.createElement('span');
                    newSpan.textContent = input.value.trim() || '';
                    input.replaceWith(newSpan);
                }
            } else {
                editBtn.disabled = false;
                editBtn.removeAttribute('aria-disabled');
                if (cb && !cb.checked) li.classList.remove('checked');
            }
        });
    };
    updateEditButtons();
    if (typeof updateProgress === 'function') updateProgress();
});
const Confetti=()=>{
const duration = 15 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 50 * (timeLeft / duration);
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);
;}
