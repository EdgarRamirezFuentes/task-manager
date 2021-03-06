// SweetAlert
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

// Vue App
const app = new Vue({
    el: '#app',
    data:{
        tasks: [],
        taskInput: '',
    },
    head: {
        script: [
            { src: './scripts/jQuery.js'},
        ]
    },
    created() {
        let self = this;
        setTimeout(function(){
            self.tasksLoader();
        },100);
    },
    methods:{
        addTask(task){
            task = task.toUpperCase();
            if(task != ''){  
                if(this.alreadyExist(task)){
                    Swal.fire(
                        'Warning'.toUpperCase(),
                        'The label '.toUpperCase() + task + ' already exists in the list.'.toUpperCase(),
                        'warning'
                    );
                    this.taskInput ='';
                }else{
                    this.tasks.push({name: task, done: false});
                    this.taskInput = '';
                    this.taskAdded(task);
                    this.tasksUpdater(this.tasks);
                }
            }else{
                Swal.fire(
                    'Error'.toUpperCase(),
                    'Label required to add the new task'.toUpperCase(),
                    'error'
                  )
            }
        },
        async modifyTask(task){   
            let {value: newName} = await Swal.fire({
                title: 'Write the new label of the task ' + task,
                input: 'text',
                inputValue: '',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Modify'.toUpperCase(),
                cancelButtonText: 'Cancel'.toUpperCase(),
                inputValidator: (value) => {
                  if (!value) {
                    return 'Label required'.toUpperCase();
                  }
                }
            });
            newName= newName.toUpperCase();
            if(this.alreadyExist(newName)){
                Swal.fire(
                    'ERROR'.toUpperCase(),
                    'The label '.toUpperCase() + task + ' already exists in the list.'.toUpperCase(),
                    'error'
                );
            }else{
                for(taskF of this.tasks){
                    if(taskF.name == task){
                        taskF.name = newName;
                        this.taskModified();
                        this.tasksUpdater(this.tasks);
                    }
                }
            }

        },
        removeTask(task){
            Swal.fire({
                title: 'Are you sure?'.toUpperCase(),
                text: "The task ".toUpperCase() + task +" will be deleted from the list".toUpperCase(),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete'.toUpperCase(),
                cancelButtonText: 'Cancel'.toUpperCase(),
              }).then((result) => {
                if (result.value) {
                    this.tasks.forEach((taskF, index) =>{
                        if(taskF.name == task){
                            this.tasks.splice(index,1);
                            this.tasksUpdater(this.tasks);
                        }
                    });
                    Toast.fire({
                        type: 'success',
                        title: task +' was deleted successfully'.toUpperCase()
                    });
                }
              });
        },
        alreadyExist(task){
            let alreadyExist = false
            for(let taskF of this.tasks){
                console.log(taskF);
                if(taskF.name == task){
                    alreadyExist = true;
                    break;
                }
            }
            return alreadyExist;
        },
        taskDone(task){
            Toast.fire({
                type: 'success',
                title: task + ' done'.toUpperCase()
            });
        },
        taskPending(task){
            Toast.fire({
                type: 'warning',
                title: task +' pending'.toUpperCase()
            });
        },
        taskAdded(task){
            Toast.fire({
                type: 'success',
                title: task +' was added successfully'.toUpperCase()
            });
        },
        setDone(task){
            for(taskF of this.tasks){
                if(taskF.name == task){
                    taskF.done = true;
                    this.tasksUpdater(this.tasks);
                }
            }
        },
        setPending(task){
            for(taskF of this.tasks){
                if(taskF.name == task){
                    taskF.done = false;
                    this.tasksUpdater(this.tasks);
                }
            }
        },
        taskModified(task){
            Toast.fire({
                type: 'success',
                title: 'Label modified successfully'.toUpperCase()
            });
        },
        tasksLoader(){
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach(element =>{
                this.tasks.push(element);
            });
        },
        tasksUpdater(tasks){
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    },
});

// Sort list

var taskSList = document.getElementById('tasksList');

function sortTasks (tasksSorted, tasksLS){
    for(taskF of tasksSorted){
        for(taskF2 of tasksLS){
            if(taskF.name == taskF2.name){
                taskF.done = taskF2.done;
                break;
            }
        }
    }
    localStorage.setItem('tasks',JSON.stringify(tasksSorted));
};

const tasksListSortable = new Sortable(taskSList, {
    animation: 150,
    ghostClass: "sortable-ghost",  // Class name for the drop placeholder
	chosenClass: "sortable-chosen",  // Class name for the chosen item
	dragClass: "sortable-drag",  // Class name for the dragging item
    onSort: function (/**Event*/evt) {
        var itemEl = evt.item;  // dragged HTMLElement
		evt.to;    // target list
		evt.from;  // previous list
		evt.oldIndex;  // element's old index within old parent
		evt.newIndex;  // element's new index within new parent
		evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
		evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
		evt.clone // the clone element
		evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
        var tasksListItems = $('.taskName');
        var tasksOrder = [];
        for(taskF of tasksListItems){
            tasksOrder.push({name: taskF.innerText, done: false});
        }
        var tasksLS = JSON.parse(localStorage.getItem('tasks'));
        sortTasks(tasksOrder, tasksLS);
    },
});

